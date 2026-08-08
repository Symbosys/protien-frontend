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
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useTrackOrderQuery } from '@/api/hooks/order.hooks';

const processImageUrl = (url: string | null | undefined) => {
  if (!url) return 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=400&auto=format&fit=crop';
  if (url.startsWith('http')) return url;
  return `http://localhost:4000${url}`;
};

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [activeQuery, setActiveQuery] = useState(initialOrderId);
  const [hasSearched, setHasSearched] = useState(!!initialOrderId.trim());

  React.useEffect(() => {
    const q = searchParams.get('orderId');
    if (q && q.trim()) {
      setSearchInput(q.trim());
      setActiveQuery(q.trim());
      setHasSearched(true);
    }
  }, [searchParams]);

  const { data: trackData, isLoading, isError, error } = useTrackOrderQuery(activeQuery, hasSearched);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveQuery(searchInput.trim());
    setHasSearched(true);
  };

  // Derive tracking status and progress steps
  const order = trackData?.order;
  const ithinkData = trackData?.trackingData || trackData?.ithinkDetails;

  // Extract AWB and courier info from iThink response if present
  let awbNumber = "";
  let courierName = "";
  let trackingUrl = "";
  let statusText = order?.status ? order.status.replace(/_/g, ' ') : "Order Received";
  let estimatedDelivery = "3 - 5 Business Days";

  if (ithinkData && ithinkData.data) {
    const rawData = ithinkData.data;
    // iThink data object might be keyed by AWB or index
    const firstKey = Object.keys(rawData)[0];
    const details = firstKey ? rawData[firstKey] : null;

    if (details) {
      if (details.waybill) awbNumber = details.waybill;
      if (details.logistic_name || details.courier_name) {
        courierName = details.logistic_name || details.courier_name;
      }
      if (details.tracking_url) trackingUrl = details.tracking_url;
      if (details.current_status || details.status) {
        statusText = details.current_status || details.status;
      }
      if (details.expected_delivery_date || details.edd) {
        estimatedDelivery = details.expected_delivery_date || details.edd;
      }
    }
  }

  // Calculate current progress step (0 to 4)
  const getProgressIndex = (statusStr: string) => {
    const s = statusStr.toUpperCase();
    if (s.includes('DELIVERED')) return 4;
    if (s.includes('OUT FOR') || s.includes('DISPATCHED')) return 3;
    if (s.includes('SHIPPED') || s.includes('TRANSIT') || s.includes('IN_TRANSIT')) return 2;
    if (s.includes('PROCESSING') || s.includes('PACKED') || s.includes('CONFIRMED')) return 1;
    return 0;
  };

  const currentStepIndex = getProgressIndex(statusText);

  const timelineSteps = [
    { title: 'Order Placed', completed: currentStepIndex >= 0 },
    { title: 'Processing', completed: currentStepIndex >= 1 },
    { title: 'Shipped', completed: currentStepIndex >= 2 },
    { title: 'Out for Delivery', completed: currentStepIndex >= 3 },
    { title: 'Delivered', completed: currentStepIndex >= 4 },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F8FA] text-black pb-20">
        {/* Hero Header */}
        <div className="bg-white border-b border-gray-100 pt-28 pb-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                <Truck className="w-3.5 h-3.5" />
                Live iThink Logistics Tracking
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mb-3">
                Track Your Shipment
              </h1>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Enter your Order ID or AWB Number to get real-time delivery status.
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Order ID or AWB Number (e.g., ORD-123456)"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-[#F7F8FA] border border-gray-200 rounded-xl text-black focus:bg-white focus:border-black focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Tracking…</>
                ) : (
                  <>Track Order<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>

          {/* Error Message if not found */}
          {hasSearched && isError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>
                {(error as any)?.message || "Could not retrieve order tracking details. Please check your order ID and try again."}
              </span>
            </motion.div>
          )}

          {/* Result View */}
          <AnimatePresence>
            {hasSearched && trackData && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Status Header */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Order #{order?.orderNumber || activeQuery}
                    </p>
                    <h2 className="text-xl font-bold text-black capitalize">{statusText}</h2>
                    {courierName && (
                      <p className="text-xs text-gray-500 mt-1">
                        Courier: <span className="font-semibold text-black">{courierName}</span>
                        {awbNumber && <span className="ml-2 font-mono">({awbNumber})</span>}
                      </p>
                    )}
                  </div>
                  <div className="sm:text-right flex flex-col sm:items-end">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Est. Delivery
                    </p>
                    <p className="text-sm font-bold text-black">{estimatedDelivery}</p>
                    {trackingUrl && (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline mt-2"
                      >
                        iThink Tracking Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                    Shipment Progress
                  </p>
                  <div className="relative">
                    <div className="grid grid-cols-5 gap-2">
                      {timelineSteps.map((step, i) => {
                        const done = step.completed;
                        const current = i === currentStepIndex;
                        return (
                          <div key={i} className="flex flex-col items-center gap-2 text-center">
                            <div
                              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                                done ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-400'
                              } ${current ? 'ring-4 ring-black/10' : ''}`}
                            >
                              {done ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                              )}
                            </div>
                            <p className={`text-[10px] font-bold leading-tight ${done ? 'text-black' : 'text-gray-400'}`}>
                              {step.title}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order Items if available */}
                {order && order.items && order.items.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Items in Order ({order.items.length})
                    </p>
                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-[#F7F8FA] rounded-xl border border-gray-100">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={processImageUrl(item.productImage)}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-black truncate">{item.productName}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} • ₹{Number(item.unitPrice || 0).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
            <p className="text-xs text-gray-400 mb-2">Need help with your shipment?</p>
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
