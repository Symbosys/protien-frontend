import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderDetailQuery } from '@/api/hooks/order.hooks';
import {
    ChevronLeft,
    Package,
    Truck,
    CheckCircle,
    MapPin,
    CreditCard,
    Download,
    HelpCircle,
    Printer,
    Share2,
    Star,
    RefreshCcw,
    AlertCircle,
    Phone,
    Copy,
    ExternalLink,
    Box,
    Clock,
    ShoppingBag
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

// Mock Data for the specific order
const ORDER_DETAILS = {
    id: 'FK-5001',
    date: '2025-12-08T10:12:00Z',
    status: 'Delivered',
    estimatedDelivery: '2025-12-10',
    courier: {
        name: 'BlueDart Express',
        trackingId: 'BD123456789IN',
        contact: '+91 1800-202-6161',
        trackingLink: '#'
    },
    shippingAddress: {
        name: 'Amit Das',
        type: 'Home',
        phone: '+91 98765 43210',
        address: 'Flat 402, Sunshine Heights, Sector 18',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
    },
    billingAddress: {
        name: 'Amit Das',
        type: 'Home',
        phone: '+91 98765 43210',
        address: 'Flat 402, Sunshine Heights, Sector 18',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
    },
    payment: {
        method: 'Credit Card',
        cardLast4: '4242',
        network: 'Visa',
        status: 'Paid',
        transactionId: 'TXN_987654321'
    },
    items: [
        {
            id: 'P-101',
            name: 'Premium Slim Fit Cotton Shirt',
            brand: 'Brandify',
            image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=2525&auto=format&fit=crop',
            variant: 'Navy Blue, Size M',
            qty: 1,
            price: 799,
            originalPrice: 1499,
            returnWindow: '2025-12-20',
            status: 'Delivered'
        },
        {
            id: 'P-102',
            name: 'Ankle Length Cotton Socks (3-Pack)',
            brand: 'SoftStep',
            image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=2526&auto=format&fit=crop',
            variant: 'Multicolor, Free Size',
            qty: 1,
            price: 500,
            originalPrice: 999,
            returnWindow: '2025-12-15',
            status: 'Delivered'
        }
    ],
    pricing: {
        subtotal: 1299,
        discount: 0,
        shipping: 0,
        tax: 234, // Included in price usually, but showing breakdown
        total: 1299
    },
    timeline: [
        { status: 'Order Placed', date: '2025-12-08T10:12:00Z', completed: true, description: 'Your order has been placed.' },
        { status: 'Processing', date: '2025-12-08T14:30:00Z', completed: true, description: 'Seller has processed your order.' },
        { status: 'Shipped', date: '2025-12-09T09:00:00Z', completed: true, description: 'Item has been shipped via BlueDart.' },
        { status: 'Out for Delivery', date: '2025-12-10T08:00:00Z', completed: true, description: 'Agent is out for delivery.' },
        { status: 'Delivered', date: '2025-12-10T14:20:00Z', completed: true, description: 'Item delivered to Amit Das.' }
    ]
};

export default function OrderDetails(): JSX.Element {
    const { id } = useParams();
    const { data: dbOrder, isLoading } = useOrderDetailQuery((id as string) || "");

    const order = useMemo(() => {
        if (!dbOrder) return ORDER_DETAILS;

        const processImageUrl = (url: any) => {
            if (!url) return "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800";
            const finalUrl = typeof url === "string" ? url : (url.url || "");
            if (typeof finalUrl !== "string" || !finalUrl) return "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800";
            if (finalUrl.startsWith("http://") || finalUrl.startsWith("https://") || finalUrl.startsWith("data:") || finalUrl.startsWith("blob:")) return finalUrl;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL
                ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
                : "http://localhost:4000";
            return `${baseUrl}${finalUrl.startsWith("/") ? "" : "/"}${finalUrl}`;
        };

        return {
            id: dbOrder.orderNumber,
            date: dbOrder.placedAt || dbOrder.createdAt,
            status: dbOrder.status === 'PENDING' ? 'Processing' : dbOrder.status,
            estimatedDelivery: '2025-12-10', // Placeholder
            courier: {
                name: 'BlueDart Express',
                trackingId: 'BD123456789IN',
                contact: '+91 1800-202-6161',
                trackingLink: '#'
            },
            shippingAddress: {
                name: dbOrder.shippingName,
                type: 'Home',
                phone: dbOrder.shippingPhone,
                address: dbOrder.shippingAddress,
                city: dbOrder.shippingCity,
                state: dbOrder.shippingState,
                pincode: dbOrder.shippingPincode,
                country: 'India'
            },
            billingAddress: {
                name: dbOrder.shippingName,
                type: 'Home',
                phone: dbOrder.shippingPhone,
                address: dbOrder.shippingAddress,
                city: dbOrder.shippingCity,
                state: dbOrder.shippingState,
                pincode: dbOrder.shippingPincode,
                country: 'India'
            },
            payment: {
                method: dbOrder.paymentMethod || 'COD',
                cardLast4: 'XXXX',
                network: 'Visa',
                status: dbOrder.paymentStatus,
                transactionId: 'TXN_' + dbOrder.orderNumber
            },
            items: dbOrder.items.map((item: any) => ({
                id: item.productId,
                name: item.productName,
                brand: 'Symbosys',
                image: processImageUrl(item.productImage),
                variant: [item.color, item.size].filter(Boolean).join(", ") || 'Standard',
                qty: item.quantity,
                price: Number(item.unitPrice),
                originalPrice: Number(item.unitPrice) * 1.2,
                returnWindow: '2025-12-20',
                status: dbOrder.status === 'PENDING' ? 'Processing' : dbOrder.status
            })),
            pricing: {
                subtotal: Number(dbOrder.subtotal),
                discount: Number(dbOrder.discount),
                shipping: Number(dbOrder.shippingCharge),
                tax: Number(dbOrder.tax),
                total: Number(dbOrder.totalAmount)
            },
            timeline: [
                { status: 'Order Placed', date: dbOrder.placedAt || dbOrder.createdAt, completed: true, description: 'Your order has been placed.' },
                { status: 'Processing', date: dbOrder.createdAt, completed: dbOrder.status !== 'PENDING', description: 'Seller has processed your order.' },
                { status: 'Shipped', date: dbOrder.shippedAt || '', completed: !!dbOrder.shippedAt, description: 'Item has been shipped via courier.' },
                { status: 'Delivered', date: dbOrder.deliveredAt || '', completed: !!dbOrder.deliveredAt, description: `Item delivered to ${dbOrder.shippingName}.` }
            ]
        };
    }, [dbOrder]);

    const [rating, setRating] = useState<number>(0);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-background font-sans text-foreground pb-20 mt-24 flex items-center justify-center">
                    <p className="text-muted-foreground animate-pulse">Loading order details...</p>
                </div>
            </MainLayout>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20';
            case 'Shipped': return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20';
            case 'Processing': return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20';
            case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20';
            default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700';
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-background font-sans text-foreground pb-20 mt-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Breadcrumb / Back Navigation */}
                    <div className="mb-6">
                        <Link to="/MyntraOrderPage" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Orders
                        </Link>
                    </div>

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">Order Details</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="font-mono">Order #{order.id}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button 
                                onClick={() => window.print()} 
                                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                            >
                                <Printer className="w-4 h-4" />
                                <span className="hidden sm:inline">Print</span>
                            </button>
                            <button 
                                onClick={() => window.print()} 
                                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Invoice</span>
                            </button>
                            <Link 
                                to="/chatSupport" 
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                <HelpCircle className="w-4 h-4" />
                                <span>Need Help?</span>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column - Main Details */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Order Tracking */}
                            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-primary" />
                                    Delivery Status
                                </h2>

                                <div className="relative pl-4 sm:pl-0">
                                    {/* Vertical Line for Mobile */}
                                    <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-border sm:hidden"></div>

                                    {/* Horizontal Line for Desktop */}
                                    <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-border"></div>

                                    <div className="flex flex-col sm:flex-row justify-between relative gap-8 sm:gap-0">
                                        {order.timeline.map((step, index) => {
                                            const isCompleted = step.completed;
                                            const isLast = index === order.timeline.length - 1;

                                            return (
                                                <div key={index} className="flex sm:flex-col items-start sm:items-center relative z-10 gap-4 sm:gap-2">
                                                    {/* Icon Circle */}
                                                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted
                                                        ? 'bg-emerald-500 border-emerald-100 dark:border-emerald-900 text-white'
                                                        : 'bg-card border-border text-muted-foreground'
                                                        }`}>
                                                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-5 h-5" />}
                                                    </div>

                                                    {/* Text Content */}
                                                    <div className="sm:text-center pt-1 sm:pt-2">
                                                        <p className={`text-sm font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {step.status}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            {new Date(step.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground hidden sm:block max-w-[120px] mx-auto mt-1 leading-tight">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Courier Info */}
                                <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-background rounded-lg border border-border">
                                            <Package className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Shipped via {order.courier.name}</p>
                                            <p className="text-xs text-muted-foreground">Tracking ID: <span className="font-mono select-all">{order.courier.trackingId}</span></p>
                                        </div>
                                    </div>
                                    <a href={order.courier.trackingLink} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                        Track on Courier Website <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </section>

                            {/* Items List */}
                            <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-border">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-primary" />
                                        Items in this Order ({order.items.length})
                                    </h2>
                                </div>

                                <div className="divide-y divide-border">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-xl overflow-hidden border border-border flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                                    <div>
                                                        <p className="text-sm font-medium text-primary mb-1">{item.brand}</p>
                                                        <h3 className="text-base font-semibold text-foreground leading-tight">{item.name}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">{item.variant}</p>
                                                    </div>
                                                    <div className="text-left sm:text-right">
                                                        <p className="text-lg font-bold text-foreground">₹{item.price.toLocaleString()}</p>
                                                        {item.originalPrice > item.price && (
                                                            <p className="text-sm text-muted-foreground line-through">₹{item.originalPrice.toLocaleString()}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center gap-4">
                                                    <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                                                        Qty: <span className="font-medium text-foreground">{item.qty}</span>
                                                    </div>

                                                    {item.status === 'Delivered' && (
                                                        <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            Delivered
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-6 flex flex-wrap gap-3">
                                                    <button 
                                                        onClick={() => alert("Review functionality coming soon!")}
                                                        className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                                                    >
                                                        Write a Review
                                                    </button>
                                                    <Link 
                                                        to="/chatSupport"
                                                        className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                                                    >
                                                        <RefreshCcw className="w-4 h-4" />
                                                        Return / Exchange
                                                    </Link>
                                                    <Link 
                                                        to={`/ProductDetail`}
                                                        className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                                                    >
                                                        Buy Again
                                                    </Link>
                                                </div>

                                                <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Return window closes on {new Date(item.returnWindow).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>

                        {/* Right Column - Summary & Info */}
                        <div className="space-y-6">

                            {/* Shipping & Billing */}
                            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    Shipping Details
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Delivery Address</h3>
                                        <div className="text-sm text-foreground space-y-1">
                                            <p className="font-medium">{order.shippingAddress.name} <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-1">{order.shippingAddress.type}</span></p>
                                            <p>{order.shippingAddress.address}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                            <p>{order.shippingAddress.country}</p>
                                            <p className="mt-2 font-medium">Phone: <span className="font-normal text-muted-foreground">{order.shippingAddress.phone}</span></p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border">
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Billing Address</h3>
                                        <p className="text-sm text-muted-foreground">Same as shipping address</p>
                                    </div>
                                </div>
                            </section>

                            {/* Payment Info */}
                            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    Payment Information
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-white rounded border border-border flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-blue-600 italic">VISA</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{order.payment.method}</p>
                                                <p className="text-xs text-muted-foreground">**** {order.payment.cardLast4}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                            {order.payment.status}
                                        </span>
                                    </div>

                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div className="flex justify-between">
                                            <span>Transaction ID:</span>
                                            <span className="font-mono text-foreground">{order.payment.transactionId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment Date:</span>
                                            <span>{new Date(order.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Order Summary */}
                            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span className="text-foreground">₹{order.pricing.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Discount</span>
                                        <span className="text-emerald-600">- ₹{order.pricing.discount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600">{order.pricing.shipping === 0 ? 'Free' : `₹${order.pricing.shipping}`}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Tax</span>
                                        <span className="text-foreground">₹{order.pricing.tax.toLocaleString()}</span>
                                    </div>

                                    <div className="pt-3 mt-3 border-t border-border flex justify-between items-center">
                                        <span className="font-bold text-lg text-foreground">Total</span>
                                        <span className="font-bold text-lg text-foreground">₹{order.pricing.total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg flex gap-3">
                                    <div className="flex-shrink-0">
                                        <Box className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-blue-800 dark:text-blue-300">Savings Corner</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                                            You saved <span className="font-bold">₹{order.items.reduce((acc, item) => acc + (item.originalPrice - item.price), 0).toLocaleString()}</span> on this order!
                                        </p>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
