import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const steps = [
  { key: 'ordered', icon: Package, label: 'Order Placed' },
  { key: 'processing', icon: Clock, label: 'Processing' },
  { key: 'shipped', icon: Truck, label: 'Shipped' },
  { key: 'out', icon: MapPin, label: 'Out for Delivery' },
  { key: 'delivered', icon: CheckCircle2, label: 'Delivered' },
];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setTrackingResult({
        id: orderId,
        status: 'In Transit',
        estimatedDelivery: 'Dec 15, 2025',
        currentStep: 2,
        steps: [
          { title: 'Order Placed', date: 'Dec 10, 2025', time: '10:30 AM', completed: true },
          { title: 'Processing', date: 'Dec 11, 2025', time: '02:15 PM', completed: true },
          { title: 'Shipped', date: 'Dec 12, 2025', time: '09:45 AM', completed: true },
          { title: 'Out for Delivery', date: 'Expected Dec 15', time: '-', completed: false },
          { title: 'Delivered', date: '-', time: '-', completed: false },
        ],
        items: [
          { name: 'Premium Whey Protein', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=400&auto=format&fit=crop', price: 2499 },
          { name: 'Creatine Monohydrate', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop', price: 899 },
        ],
      });
      setIsSearching(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F8FA] text-black pb-20">
        {/* Hero */}
        <div className="bg-white border-b border-gray-100 pt-28 pb-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                <Truck className="w-3 h-3" />
                Real-Time Tracking
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mb-3">
                Track Your Order
              </h1>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Enter your order number to get live shipping status and estimated delivery date.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6"
          >
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID  (e.g., ORD-12345)"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-[#F7F8FA] border border-gray-200 rounded-xl text-black focus:bg-white focus:border-black focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !orderId.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isSearching ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Tracking…</>
                ) : (
                  <>Track Order<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>

          {/* Result */}
          <AnimatePresence>
            {trackingResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Status Header */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Order #{trackingResult.id}
                    </p>
                    <p className="text-xl font-bold text-black">{trackingResult.status}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Est. Delivery
                    </p>
                    <p className="text-sm font-bold text-black">{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                    Shipment Progress
                  </p>
                  <div className="relative">
                    {/* connector line */}
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 hidden sm:block" />
                    <div
                      className="absolute top-4 left-4 h-0.5 bg-black hidden sm:block transition-all duration-700"
                      style={{ width: `${(trackingResult.currentStep / (trackingResult.steps.length - 1)) * (100 - (100 / trackingResult.steps.length))}%` }}
                    />
                    <div className="grid grid-cols-5 gap-2">
                      {trackingResult.steps.map((step: any, i: number) => {
                        const done = i <= trackingResult.currentStep;
                        const current = i === trackingResult.currentStep;
                        return (
                          <div key={i} className="flex flex-col items-center gap-2 text-center">
                            <div
                              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                done ? 'bg-black border-black' : 'bg-white border-gray-200'
                              } ${current ? 'ring-4 ring-black/10' : ''}`}
                            >
                              {done
                                ? <CheckCircle2 className="w-4 h-4 text-white" />
                                : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                            </div>
                            <p className={`text-[10px] font-semibold leading-tight ${done ? 'text-black' : 'text-gray-400'}`}>
                              {step.title}
                            </p>
                            <p className="text-[9px] text-gray-400 leading-tight">{step.date}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Items in Shipment
                  </p>
                  <div className="space-y-3">
                    {trackingResult.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-[#F7F8FA] rounded-xl">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-black truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center pt-2"
          >
            <p className="text-xs text-gray-400 mb-2">Having trouble with your order?</p>
            <Link
              to="/support"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Contact Support
            </Link>
          </motion.div>

        </div>
      </div>
    </MainLayout>
  );
}
