import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrderDetailQuery } from "@/api/hooks/order.hooks";
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  CreditCard,
  Printer,
  Clock,
  ShoppingBag,
  Loader2,
  Loader2Icon,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";

const processImageUrl = (url: string | null | undefined) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `http://localhost:4000${url}`;
};

export default function OrderDetails(): JSX.Element {
  const { id } = useParams();
  const { data: dbOrder, isLoading } = useOrderDetailQuery((id as string) || "");

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

  const order = useMemo(() => {
    if (!dbOrder) return null;

    return {
      id: dbOrder.orderNumber,
      dbId: dbOrder.id,
      date: dbOrder.placedAt || dbOrder.createdAt,
      status: getStatusLabel(dbOrder.status),
      shippingAddress: {
        name: dbOrder.shippingName,
        phone: dbOrder.shippingPhone,
        address: dbOrder.shippingAddress,
        city: dbOrder.shippingCity,
        state: dbOrder.shippingState,
        pincode: dbOrder.shippingPincode,
        country: "India",
      },
      payment: {
        method: dbOrder.paymentMethod || "COD",
        status: dbOrder.paymentStatus,
        transactionId: dbOrder.cashfreeOrderId || ("TXN_" + dbOrder.orderNumber),
      },
      items: dbOrder.items.map((item: any) => ({
        id: item.productId,
        name: item.productName,
        image: item.productImage,
        variant: [item.color, item.size].filter(Boolean).join(", ") || "Standard",
        qty: item.quantity,
        price: Number(item.unitPrice),
      })),
      pricing: {
        subtotal: Number(dbOrder.subtotal),
        discount: Number(dbOrder.discount),
        shipping: Number(dbOrder.shippingCharge),
        tax: Number(dbOrder.tax),
        total: Number(dbOrder.totalAmount),
      },
      timeline: [
        {
          status: "Order Placed",
          date: dbOrder.placedAt || dbOrder.createdAt,
          completed: true,
          description: "Your order has been successfully placed.",
        },
        {
          status: "Processing",
          date: dbOrder.createdAt,
          completed: dbOrder.status !== "PENDING",
          description: "Seller has accepted and is preparing your items.",
        },
        {
          status: "Shipped",
          date: dbOrder.shippedAt || "",
          completed: !!dbOrder.shippedAt,
          description: "Courier partner has picked up the package.",
        },
        {
          status: "Delivered",
          date: dbOrder.deliveredAt || "",
          completed: !!dbOrder.deliveredAt,
          description: `Successfully delivered to ${dbOrder.shippingName}.`,
        },
      ],
    };
  }, [dbOrder]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#FAF9F6] font-sans text-black pb-20 mt-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2Icon className="h-8 w-8 text-black animate-spin" />
            <span className="text-sm text-gray-500">Loading order details...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#FAF9F6] font-sans text-black pb-20 mt-24 flex items-center justify-center">
          <p className="text-gray-500">Order not found.</p>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "Shipped":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "Processing":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "Cancelled":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FAF9F6] font-sans text-black pb-20 mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/account/orders"
              className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-black transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Orders
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-black tracking-tight">
                  Order Details
                </h1>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border",
                    getStatusColor(order.status)
                  )}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="font-mono font-bold">Order #{order.id}</span>
                <span className="hidden sm:inline">•</span>
                <span>
                  Placed on{" "}
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-black hover:border-black transition-colors shadow-sm self-start sm:self-center"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Timeline & Items */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Timeline */}
              <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Truck className="w-4 h-4 text-black" />
                  Delivery Status
                </h2>

                <div className="relative pl-4 sm:pl-0">
                  <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100 sm:hidden"></div>
                  <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-gray-100"></div>

                  <div className="flex flex-col sm:flex-row justify-between relative gap-8 sm:gap-0">
                    {order.timeline.map((step, index) => {
                      const isCompleted = step.completed;
                      return (
                        <div
                          key={index}
                          className="flex sm:flex-col items-start sm:items-center relative z-10 gap-4 sm:gap-2"
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full border-4 flex items-center justify-center flex-shrink-0 transition-colors bg-white",
                              isCompleted
                                ? "bg-emerald-500 border-emerald-100 text-white"
                                : "border-gray-200 text-gray-400"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>

                          <div className="sm:text-center pt-1 sm:pt-2">
                            <p
                              className={cn(
                                "text-xs font-semibold",
                                isCompleted ? "text-black" : "text-gray-400"
                              )}
                            >
                              {step.status}
                            </p>
                            {isCompleted && step.date && (
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                {new Date(step.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Items List */}
              <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-black" />
                    Items in this Order ({order.items.length})
                  </h2>
                </div>

                <div className="divide-y divide-gray-100 bg-white">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 flex gap-6 items-center bg-white"
                    >
                      <div className="w-20 h-20 bg-[#FAF9F6] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center p-1 shadow-sm">
                        {item.image ? (
                          <img
                            src={processImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-gray-300" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-black leading-tight">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.variant}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-bold text-black">
                              ₹{item.price.toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Qty: {item.qty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Address & Pricing Summary */}
            <div className="space-y-6">
              {/* Shipping details */}
              <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <MapPin className="w-4 h-4 text-black" />
                  Shipping Details
                </h2>

                <div className="text-xs text-gray-700 space-y-2">
                  <p className="font-semibold text-black text-sm">
                    {order.shippingAddress.name}
                  </p>
                  <p className="leading-relaxed">{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - <span className="font-bold">{order.shippingAddress.pincode}</span>
                  </p>
                  <p className="font-medium text-black">
                    Phone: <span className="font-normal text-gray-500">{order.shippingAddress.phone}</span>
                  </p>
                </div>
              </section>

              {/* Payment Details */}
              <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CreditCard className="w-4 h-4 text-black" />
                  Payment Details
                </h2>

                <div className="space-y-3 text-xs text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Method</span>
                    <span className="font-semibold text-black">{order.payment.method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full">
                      {order.payment.status}
                    </span>
                  </div>
                  {order.payment.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Transaction ID</span>
                      <span className="font-mono text-black font-semibold truncate max-w-[120px]" title={order.payment.transactionId}>
                        {order.payment.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* Order Summary */}
              <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-semibold text-black">
                      ₹{order.pricing.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {order.pricing.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Discount</span>
                      <span className="font-semibold text-emerald-600">
                        - ₹{order.pricing.discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Shipping</span>
                    <span className="font-semibold text-black">
                      {order.pricing.shipping === 0
                        ? "Free"
                        : `₹${order.pricing.shipping.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  {order.pricing.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Tax</span>
                      <span className="font-semibold text-black">
                        ₹{order.pricing.tax.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-sm text-black">
                      Total
                    </span>
                    <span className="font-bold text-base text-black">
                      ₹{order.pricing.total.toLocaleString("en-IN")}
                    </span>
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
