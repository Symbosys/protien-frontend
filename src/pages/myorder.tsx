"use client"

import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ShoppingBag,
  ArrowRight,
  Loader2,
  MapPin
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useMyOrdersQuery } from '@/api/hooks/order.hooks';
import { cn } from '@/lib/utils';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | string;

const processImageUrl = (url: string | null | undefined) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `http://localhost:4000${url}`;
};

export default function MyOrder(): JSX.Element {
  const [query, setQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-asc' | 'price-desc'>('newest');

  const { data: dbOrders, isLoading } = useMyOrdersQuery();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'Processing';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      case 'RETURN_REQUESTED':
        return 'Return Requested';
      case 'RETURNED':
        return 'Returned';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  const mappedOrders = useMemo(() => {
    if (!dbOrders) return [];
    return dbOrders.map((dbO) => ({
      id: dbO.orderNumber,
      dbId: dbO.id,
      date: dbO.placedAt || dbO.createdAt,
      status: getStatusLabel(dbO.status),
      total: Number(dbO.totalAmount),
      payment: dbO.paymentMethod || 'COD',
      items: dbO.items.map((item: any) => ({
        name: item.productName,
        qty: item.quantity,
        price: Number(item.unitPrice),
        image: item.productImage
      }))
    }));
  }, [dbOrders]);

  const filtered = useMemo(() => {
    let list = mappedOrders.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q))
      );
    }

    if (activeStatusTab !== 'All') {
      list = list.filter((o) => o.status === activeStatusTab);
    }

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
  }, [query, activeStatusTab, sortBy, mappedOrders]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FAF9F6] text-black pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl text-black font-normal tracking-wide">
              My Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your order history</p>
          </div>

          {/* Search & Sort Row */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by order ID or product name..."
                className="pl-10 pr-4 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Sort by</span>
              <div className="relative w-full md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-black focus:outline-none focus:border-black cursor-pointer appearance-none transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-3 h-3 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 border-b border-gray-200 pb-3 mb-8 overflow-x-auto scrollbar-none">
            {(['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={cn(
                  "px-4 py-2 text-xs font-semibold rounded-full border transition-all whitespace-nowrap",
                  activeStatusTab === tab
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-500 border-gray-200 hover:text-black hover:border-gray-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders Content */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Loader2 className="h-8 w-8 text-black animate-spin mb-4" />
                <h3 className="text-sm font-bold text-black">Loading orders...</h3>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-xl shadow-sm px-6 text-center">
                <div className="h-14 w-14 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-base font-bold text-black">No orders found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  We couldn't find any orders matching your criteria. Try adjusting filters or search query.
                </p>
              </div>
            ) : (
              filtered.map((o) => (
                <article
                  key={o.dbId}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="px-6 py-4 bg-gray-50/75 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-6">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 block mb-0.5">Order ID</span>
                        <span className="font-mono text-xs font-bold text-black">#{o.id}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 block mb-0.5">Date Placed</span>
                        <span className="text-xs font-bold text-black">
                          {new Date(o.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 block mb-0.5">Total Amount</span>
                        <span className="text-xs font-bold text-black">₹{o.total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border",
                      o.status === 'Delivered' ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                      o.status === 'Shipped' ? "text-blue-700 bg-blue-50 border-blue-200" :
                      o.status === 'Processing' ? "text-amber-700 bg-amber-50 border-amber-200" :
                      "text-gray-600 bg-gray-50 border-gray-200"
                    )}>
                      {o.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="h-16 w-16 flex-shrink-0 bg-[#FAF9F6] border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center p-1 shadow-sm">
                            {it.image ? (
                              <img
                                src={processImageUrl(it.image)}
                                alt={it.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <ShoppingBag className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-black truncate pr-4">{it.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Qty: {it.qty} × ₹{it.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">
                        Payment via {o.payment}
                      </span>
                      <Link
                        to={`/order/${o.dbId}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 hover:border-black rounded-lg text-xs font-bold text-black transition-colors"
                      >
                        Track Order / Details
                        <ArrowRight className="h-3 w-3 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
