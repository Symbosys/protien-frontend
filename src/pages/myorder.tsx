import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  X,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCcw,
  Download,
  Eye,
  Star,
  ArrowRight,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useMyOrdersQuery } from '@/api/hooks/order.hooks';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';

type Order = {
  id: string;
  date: string; // ISO
  status: OrderStatus;
  total: number;
  payment: string;
  category: string;
  merchant: string;
  returnable: boolean;
  cod: boolean; // cash on delivery
  rating?: number; // average product rating
  items: { name: string; qty: number; price: number }[];
};

/* 
const MOCK_ORDERS: Order[] = [
  {
    id: 'FK-5001',
    date: '2025-12-08T10:12:00Z',
    status: 'Delivered',
    total: 1299,
    payment: 'Credit Card',
    category: 'Clothing',
    merchant: 'Brandify',
    returnable: true,
    cod: false,
    rating: 4.2,
    items: [
      { name: 'Slim Shirt', qty: 1, price: 799 },
      { name: 'Socks (3-pack)', qty: 1, price: 500 },
    ],
  },
  {
    id: 'FK-5002',
    date: '2025-12-05T14:22:00Z',
    status: 'Shipped',
    total: 2499,
    payment: 'UPI',
    category: 'Footwear',
    merchant: 'ShoeHouse',
    returnable: false,
    cod: false,
    rating: 4.6,
    items: [{ name: 'Sneakers', qty: 1, price: 2499 }],
  },
  {
    id: 'FK-5003',
    date: '2025-11-30T09:05:00Z',
    status: 'Processing',
    total: 399,
    payment: 'Wallet',
    category: 'Accessories',
    merchant: 'CapCorner',
    returnable: true,
    cod: true,
    rating: 3.9,
    items: [{ name: 'Cap', qty: 1, price: 399 }],
  },
  {
    id: 'FK-5004',
    date: '2025-11-20T18:00:00Z',
    status: 'Cancelled',
    total: 1599,
    payment: 'Credit Card',
    category: 'Outerwear',
    merchant: 'JacketWorld',
    returnable: false,
    cod: false,
    rating: 4.0,
    items: [{ name: 'Jacket', qty: 1, price: 1599 }],
  },
  {
    id: 'FK-5005',
    date: '2025-10-01T12:00:00Z',
    status: 'Refunded',
    total: 499,
    payment: 'Debit Card',
    category: 'Accessories',
    merchant: 'BeltBazaar',
    returnable: false,
    cod: false,
    rating: 3.5,
    items: [{ name: 'Belt', qty: 1, price: 499 }],
  },
  {
    id: 'FK-5006',
    date: '2025-09-15T11:00:00Z',
    status: 'Delivered',
    total: 999,
    payment: 'Cash',
    category: 'Home',
    merchant: 'HomeEssentials',
    returnable: true,
    cod: true,
    rating: 4.8,
    items: [{ name: 'Cushion Cover Set', qty: 2, price: 499 }],
  },
];
*/

export default function MyOrder(): JSX.Element {
  const [query, setQuery] = useState('');
  const [statusSet, setStatusSet] = useState<OrderStatus[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<'All' | string>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | string>('All');
  const [merchantFilter, setMerchantFilter] = useState<'All' | string>('All');
  const [returnableOnly, setReturnableOnly] = useState<'All' | 'Yes' | 'No'>('All');
  const [codFilter, setCodFilter] = useState<'All' | 'COD' | 'Prepaid'>('All');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [minRating, setMinRating] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-asc' | 'price-desc'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const { data: dbOrders, isLoading } = useMyOrdersQuery();

  const mappedOrders = useMemo(() => {
    if (!dbOrders) return [];
    return dbOrders.map((dbO) => ({
      id: dbO.orderNumber,
      date: dbO.placedAt || dbO.createdAt,
      status: (dbO.status === 'PENDING' ? 'Processing' : 
               dbO.status === 'CONFIRMED' ? 'Processing' : 
               dbO.status) as OrderStatus,
      total: Number(dbO.totalAmount),
      payment: dbO.paymentMethod || 'COD',
      category: 'General',
      merchant: 'Symbosys',
      returnable: true,
      cod: dbO.paymentMethod === 'COD',
      rating: 5,
      items: dbO.items.map((item: any) => ({
        name: item.productName,
        qty: item.quantity,
        price: Number(item.unitPrice)
      }))
    }));
  }, [dbOrders]);

  const payments = useMemo(() => Array.from(new Set(mappedOrders.map((o) => o.payment))), [mappedOrders]);
  const categories = useMemo(() => Array.from(new Set(mappedOrders.map((o) => o.category))), [mappedOrders]);
  const merchants = useMemo(() => Array.from(new Set(mappedOrders.map((o) => o.merchant))), [mappedOrders]);

  const toggleStatus = (s: OrderStatus) => {
    setStatusSet((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const filtered = useMemo(() => {
    let list = mappedOrders.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q)) ||
          o.merchant.toLowerCase().includes(q)
      );
    }

    if (statusSet.length > 0) list = list.filter((o) => statusSet.includes(o.status));
    if (paymentFilter !== 'All') list = list.filter((o) => o.payment === paymentFilter);
    if (categoryFilter !== 'All') list = list.filter((o) => o.category === categoryFilter);
    if (merchantFilter !== 'All') list = list.filter((o) => o.merchant === merchantFilter);
    if (returnableOnly !== 'All') list = list.filter((o) => (returnableOnly === 'Yes' ? o.returnable : !o.returnable));
    if (codFilter !== 'All') list = list.filter((o) => (codFilter === 'COD' ? o.cod : !o.cod));
    if (minPrice !== '') list = list.filter((o) => o.total >= Number(minPrice));
    if (maxPrice !== '') list = list.filter((o) => o.total <= Number(maxPrice));

    if (dateFrom) list = list.filter((o) => new Date(o.date) >= new Date(dateFrom));
    if (dateTo) list = list.filter((o) => new Date(o.date) <= new Date(dateTo + 'T23:59:59'));

    if (minRating !== '') list = list.filter((o) => (o.rating ?? 0) >= Number(minRating));

    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        break;
      case 'oldest':
        list.sort((a, b) => +new Date(a.date) - +new Date(b.date));
        break;
      case 'price-asc':
        list.sort((a, b) => a.total - b.total);
        break;
      case 'price-desc':
        list.sort((a, b) => b.total - a.total);
        break;
    }

    return list;
  }, [
    query,
    statusSet,
    paymentFilter,
    categoryFilter,
    merchantFilter,
    returnableOnly,
    codFilter,
    minPrice,
    maxPrice,
    dateFrom,
    dateTo,
    minRating,
    sortBy,
    mappedOrders
  ]);

  const clearFilters = () => {
    setQuery('');
    setStatusSet([]);
    setPaymentFilter('All');
    setCategoryFilter('All');
    setMerchantFilter('All');
    setReturnableOnly('All');
    setCodFilter('All');
    setMinPrice('');
    setMaxPrice('');
    setDateFrom('');
    setDateTo('');
    setMinRating('');
    setSortBy('newest');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20';
      case 'Shipped': return 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20';
      case 'Processing': return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20';
      case 'Cancelled': return 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20';
      case 'Refunded': return 'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20';
      default: return 'text-slate-700 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Shipped': return <Truck className="w-3.5 h-3.5" />;
      case 'Processing': return <Package className="w-3.5 h-3.5" />;
      case 'Cancelled': return <X className="w-3.5 h-3.5" />;
      case 'Refunded': return <RefreshCcw className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background font-sans text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">My Orders</h1>
              <p className="text-muted-foreground mt-1">Track and manage your recent purchases</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by ID, product, or merchant..."
                  className="pl-10 pr-4 py-2.5 w-full sm:w-80 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <button
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                onClick={() => setShowFilters((s) => !s)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Filters */}
            <aside className={`lg:col-span-3 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-xs font-medium text-primary hover:text-primary/80 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Status</label>
                    <div className="space-y-2">
                      {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'] as OrderStatus[]).map((s) => (
                        <label key={s} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${statusSet.includes(s) ? 'bg-primary border-primary' : 'border-input group-hover:border-primary/50'}`}>
                            {statusSet.includes(s) && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={statusSet.includes(s)}
                            onChange={() => toggleStatus(s)}
                            className="hidden"
                          />
                          <span className={`text-sm ${statusSet.includes(s) ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Price Range</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-muted-foreground text-xs">₹</span>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Min"
                          className="w-full pl-6 pr-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <span className="text-muted-foreground">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-muted-foreground text-xs">₹</span>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Max"
                          className="w-full pl-6 pr-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Common Select Filters */}
                  {[
                    { label: 'Payment Method', value: paymentFilter, setter: setPaymentFilter, options: payments },
                    { label: 'Category', value: categoryFilter, setter: setCategoryFilter, options: categories },
                    { label: 'Merchant', value: merchantFilter, setter: setMerchantFilter, options: merchants },
                  ].map((filter) => (
                    <div key={filter.label}>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">{filter.label}</label>
                      <div className="relative">
                        <select
                          value={filter.value}
                          onChange={(e) => filter.setter(e.target.value as any)}
                          className="w-full pl-3 pr-8 py-2 bg-background border border-input rounded-lg text-sm appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer text-foreground"
                        >
                          <option value="All">All {filter.label}s</option>
                          {filter.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  ))}

                  {/* Date Range */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Order Date</label>
                    <div className="space-y-2">
                      <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" />
                      <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-9">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filtered.length}</span> orders
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="pl-3 pr-8 py-1.5 bg-card border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-primary cursor-pointer text-foreground"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-card border border-dashed border-border rounded-2xl">
                    <RefreshCcw className="h-8 w-8 text-primary animate-spin mb-4" />
                    <h3 className="text-lg font-medium text-foreground">Loading orders...</h3>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-card border border-dashed border-border rounded-2xl">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No orders found</h3>
                    <p className="text-muted-foreground mt-1">We couldn't find any orders matching your filters.</p>
                    <button onClick={clearFilters} className="mt-6 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors">
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  filtered.map((o) => (
                    <article key={o.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                      {/* Card Header */}
                      <div className="px-6 py-4 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">Order ID</span>
                            <span className="font-mono font-medium text-foreground">#{o.id}</span>
                          </div>
                          <div className="hidden sm:block w-px h-8 bg-border"></div>
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">Date Placed</span>
                            <span className="text-sm text-foreground font-medium">{new Date(o.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>

                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(o.status)}`}>
                          {getStatusIcon(o.status)}
                          {o.status}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Items List */}
                          <div className="flex-1 space-y-6">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="flex items-start gap-4 group/item">
                                <div className="h-20 w-20 flex-shrink-0 bg-muted rounded-xl flex items-center justify-center text-muted-foreground border border-border group-hover/item:border-primary/30 transition-colors">
                                  <ShoppingBag className="h-8 w-8 opacity-40" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-foreground truncate pr-4">{it.name}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">Qty: {it.qty} × ₹{it.price.toLocaleString()}</p>

                                  <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md font-medium">
                                      {o.category}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md font-medium">
                                      {o.merchant}
                                    </span>
                                    {o.rating && (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs rounded-md font-medium">
                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {o.rating}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Total & Actions */}
                          <div className="flex flex-col items-end justify-between min-w-[200px] border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8 mt-4 md:mt-0">
                            <div className="text-right w-full">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Amount</span>
                              <div className="text-2xl font-bold text-foreground mt-1">₹{o.total.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                                via {o.payment}
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full mt-8">
                              <Link to={`/order/${o.id}`} className="w-full px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <Eye className="h-4 w-4" /> View Details
                              </Link>
                              <div className="flex gap-3">
                                <button className="flex-1 px-3 py-2.5 bg-card border border-border text-foreground text-sm font-medium rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2" title="Download Invoice">
                                  <Download className="h-4 w-4" /> <span className="sr-only sm:not-sr-only sm:inline">Invoice</span>
                                </button>
                                {o.returnable && (
                                  <button className="flex-1 px-3 py-2.5 bg-card border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                    Return
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
