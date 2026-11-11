"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useOrderDetailQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useUpdateOrderAddressMutation,
} from "@/api/hooks/order.hooks";
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
  Loader2Icon,
  RotateCcw,
  Edit3,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const processImageUrl = (url: string | null | undefined) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `http://localhost:4000${url}`;
};

export default function OrderDetails(): JSX.Element {
  const { id } = useParams();
  const { data: dbOrder, isLoading } = useOrderDetailQuery((id as string) || "");

  const cancelMutation = useCancelOrderMutation();
  const returnMutation = useReturnOrderMutation();
  const updateAddressMutation = useUpdateOrderAddressMutation();

  // Dialog States
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
  });

  useEffect(() => {
    if (dbOrder) {
      setAddressForm({
        shippingName: dbOrder.shippingName || "",
        shippingPhone: dbOrder.shippingPhone || "",
        shippingAddress: dbOrder.shippingAddress || "",
        shippingCity: dbOrder.shippingCity || "",
        shippingState: dbOrder.shippingState || "",
        shippingPincode: dbOrder.shippingPincode || "",
      });
    }
  }, [dbOrder]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "CONFIRMED":
        return "Confirmed";
      case "PROCESSING":
        return "Processing";
      case "SHIPPED":
        return "Shipped";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      case "RETURN_REQUESTED":
      case "RETURNED":
        return "Returned";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  const isCancellable =
    dbOrder && (dbOrder.status === "PENDING" || dbOrder.status === "CONFIRMED");
  const isAddressEditable =
    dbOrder && (dbOrder.status === "PENDING" || dbOrder.status === "CONFIRMED");
  const isReturnable = dbOrder && dbOrder.status === "DELIVERED";

  const handleCancelOrder = () => {
    if (!dbOrder) return;
    cancelMutation.mutate(dbOrder.id, {
      onSuccess: () => {
        setIsCancelDialogOpen(false);
        toast.success("Order cancelled successfully and stock restored.");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to cancel order");
      },
    });
  };

  const handleReturnOrder = () => {
    if (!dbOrder) return;
    if (!returnReason.trim()) {
      toast.error("Please enter a reason for returning the order.");
      return;
    }
    returnMutation.mutate(
      { orderId: dbOrder.id, returnReason: returnReason.trim() },
      {
        onSuccess: () => {
          setIsReturnDialogOpen(false);
          setReturnReason("");
          toast.success("iThink Logistics return order and pickup created successfully");
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Failed to initiate return pickup"
          );
        },
      }
    );
  };

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbOrder) return;
    if (
      !addressForm.shippingName ||
      !addressForm.shippingPhone ||
      !addressForm.shippingAddress ||
      !addressForm.shippingCity ||
      !addressForm.shippingState ||
      !addressForm.shippingPincode
    ) {
      toast.error("Please fill in all address fields.");
      return;
    }

    updateAddressMutation.mutate(
      {
        orderId: dbOrder.id,
        ...addressForm,
      },
      {
        onSuccess: () => {
          setIsAddressDialogOpen(false);
          toast.success("Shipping address updated and synced with iThink Logistics successfully.");
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Failed to update shipping address"
          );
        },
      }
    );
  };

  const order = useMemo(() => {
    if (!dbOrder) return null;

    const timelineSteps = [
      {
        status: "Pending",
        date: dbOrder.placedAt || dbOrder.createdAt,
        completed: true,
        description: "Your order has been placed.",
      },
      {
        status: "Confirmed",
        date: dbOrder.createdAt,
        completed:
          dbOrder.status !== "PENDING" && dbOrder.status !== "CANCELLED",
        description: "Order confirmed and being prepared.",
      },
      {
        status: "Shipped",
        date: dbOrder.shippedAt || "",
        completed:
          ["SHIPPED", "DELIVERED", "RETURNED"].includes(dbOrder.status) ||
          !!dbOrder.shippedAt,
        description: "Package dispatched with courier partner.",
      },
      {
        status: "Delivered",
        date: dbOrder.deliveredAt || "",
        completed:
          ["DELIVERED", "RETURNED"].includes(dbOrder.status) ||
          !!dbOrder.deliveredAt,
        description: `Successfully delivered to ${dbOrder.shippingName}.`,
      },
    ];

    if (dbOrder.status === "RETURNED") {
      timelineSteps.push({
        status: "Returned",
        date: dbOrder.updatedAt || "",
        completed: true,
        description: dbOrder.returnReason
          ? `Return Pickup: ${dbOrder.returnReason}`
          : "Return package scheduled with courier partner.",
      });
    } else if (dbOrder.status === "CANCELLED") {
      timelineSteps.push({
        status: "Cancelled",
        date: dbOrder.cancelledAt || dbOrder.updatedAt || "",
        completed: true,
        description: "Order has been cancelled.",
      });
    }

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
        shipping: Number(dbOrder.shippingCharge || 0),
        tax: Number(dbOrder.tax || 0),
        total: Number(dbOrder.totalAmount),
      },
      timeline: timelineSteps,
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

  if (!order || !dbOrder) {
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
      case "Confirmed":
      case "Processing":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "Cancelled":
        return "text-red-700 bg-red-50 border-red-200";
      case "Returned":
        return "text-purple-700 bg-purple-50 border-purple-200";
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

            <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
              {/* Return Order Button (Visible only when DELIVERED) */}
              {isReturnable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReturnDialogOpen(true)}
                  className="inline-flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 text-xs font-bold"
                >
                  <RotateCcw className="w-4 h-4" />
                  Return Order
                </Button>
              )}

              {/* Cancel Button (Visible only when PENDING or CONFIRMED) */}
              {isCancellable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCancelDialogOpen(true)}
                  className="inline-flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </Button>
              )}

              {/* Track shipment link */}
              <Link
                to={`/track-order?orderId=${order.id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-900 transition-colors shadow-sm"
              >
                <Truck className="w-4 h-4" />
                Track Shipment
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-black hover:border-black transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
            </div>
          </div>

          {/* iThink Logistics Tracking Card if Waybill or OrderId is assigned */}
          {(dbOrder.waybill || dbOrder.ithinklogisticsOrderId) && (
            <div className="mb-8 bg-sky-50/70 border border-sky-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center flex-shrink-0 text-sky-700">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-sky-950">
                      iThink Logistics Shipment
                    </span>
                    {dbOrder.waybill ? (
                      <span className="px-2 py-0.5 rounded bg-sky-200/80 text-sky-900 font-mono text-xs font-bold">
                        AWB: {dbOrder.waybill}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-sky-200/50 text-sky-800 text-xs">
                        AWB Generating
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-sky-800">
                    {dbOrder.ithinklogisticsOrderId && (
                      <span>iThink Order ID: <strong className="font-mono">{dbOrder.ithinklogisticsOrderId}</strong></span>
                    )}
                    {dbOrder.ithinklogisticsShipmentId && (
                      <span className="ml-2">| Shipment ID: <strong className="font-mono">{dbOrder.ithinklogisticsShipmentId}</strong></span>
                    )}
                  </p>
                </div>
              </div>
              <Link
                to={`/track-order?orderId=${order.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs w-full sm:w-auto"
              >
                <Truck className="w-4 h-4" />
                Live Tracking
              </Link>
            </div>
          )}

          {/* Return Reason Card if order is Returned */}
          {dbOrder.status === "RETURNED" && dbOrder.returnReason && (
            <div className="mb-8 bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 flex items-start gap-3">
              <RotateCcw className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold mb-0.5">Return Reason Recorded</p>
                <p className="text-purple-800 leading-relaxed">{dbOrder.returnReason}</p>
                <p className="text-[11px] text-purple-600 mt-1">
                  iThink Logistics reverse pickup scheduled. Our courier agent will contact you for pickup.
                </p>
              </div>
            </div>
          )}

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
                                ? step.status === "Returned"
                                  ? "bg-purple-600 border-purple-100 text-white"
                                  : step.status === "Cancelled"
                                  ? "bg-red-500 border-red-100 text-white"
                                  : "bg-emerald-500 border-emerald-100 text-white"
                                : "border-gray-200 text-gray-400"
                            )}
                          >
                            {isCompleted ? (
                              step.status === "Returned" ? (
                                <RotateCcw className="w-5 h-5" />
                              ) : step.status === "Cancelled" ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )
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
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-black" />
                    Shipping Details
                  </h2>
                  {/* Edit Address Button (Visible before order is shipped) */}
                  {isAddressEditable && (
                    <button
                      onClick={() => setIsAddressDialogOpen(true)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Address
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-700 space-y-2">
                  <p className="font-semibold text-black text-sm">
                    {order.shippingAddress.name}
                  </p>
                  <p className="leading-relaxed">{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                    <span className="font-bold">{order.shippingAddress.pincode}</span>
                  </p>
                  <p className="font-medium text-black">
                    Phone:{" "}
                    <span className="font-normal text-gray-500">
                      {order.shippingAddress.phone}
                    </span>
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
                    <span
                      className={cn(
                        "font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-full border",
                        order.payment.status === "PAID"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : order.payment.status === "FAILED" ||
                            order.payment.status === "REFUNDED"
                          ? "text-red-700 bg-red-50 border-red-200"
                          : "text-amber-700 bg-amber-50 border-amber-200"
                      )}
                    >
                      {order.payment.status}
                    </span>
                  </div>
                  {order.payment.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Transaction ID</span>
                      <span
                        className="font-mono text-black font-semibold truncate max-w-[120px]"
                        title={order.payment.transactionId}
                      >
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
                      <span className="text-emerald-600 font-medium">
                        Online Payment Discount (5%)
                      </span>
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
                      <span className="text-gray-500 font-medium">Tax (5%)</span>
                      <span className="font-semibold text-black">
                        ₹{order.pricing.tax.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-sm text-black">Total</span>
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

      {/* Cancel Order Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Cancel Order #{dbOrder.orderNumber}?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action will cancel your shipment and restore the items to inventory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Keep Order
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={handleCancelOrder}
            >
              {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Order Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-700">
              <RotateCcw className="w-5 h-5" />
              Return Order #{dbOrder.orderNumber}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for return. An iThink Logistics reverse pickup will be scheduled at your delivery address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <label className="text-xs font-semibold text-gray-700">
              Return Reason <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="e.g. Size didn't fit, defective seal, received incorrect flavor..."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReturnDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={returnMutation.isPending}
              onClick={handleReturnOrder}
            >
              {returnMutation.isPending ? "Submitting..." : "Submit Return Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              Update Shipping Address
            </DialogTitle>
            <DialogDescription>
              Update your delivery address before dispatch. Changes will automatically sync with iThink Logistics.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAddress} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Full Name</label>
                <Input
                  value={addressForm.shippingName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, shippingName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Phone (10 digits)</label>
                <Input
                  value={addressForm.shippingPhone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, shippingPhone: e.target.value })
                  }
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Street Address</label>
              <Input
                value={addressForm.shippingAddress}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, shippingAddress: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">City</label>
                <Input
                  value={addressForm.shippingCity}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, shippingCity: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">State</label>
                <Input
                  value={addressForm.shippingState}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, shippingState: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Pincode</label>
                <Input
                  value={addressForm.shippingPincode}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, shippingPincode: e.target.value })
                  }
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddressDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white"
                disabled={updateAddressMutation.isPending}
              >
                {updateAddressMutation.isPending ? "Syncing..." : "Save & Sync Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
