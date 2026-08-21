import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  CreditCard,
  Truck,
  MapPin,
  ChevronRight,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/api/hooks/order.hooks";
import { useAddressesQuery } from "@/api/hooks/address.hooks";
import { toast } from "sonner";

const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const steps = [
  { id: "shipping-payment", title: "Details & Payment", icon: MapPin },
  { id: "review", title: "Review & Place Order", icon: Check },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const { items, subtotal } = useCart();

  const createOrderMutation = useCreateOrderMutation();
  const verifyPaymentMutation = useVerifyPaymentMutation();
  const { data: addresses, isLoading } = useAddressesQuery();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const [formData, setFormData] = useState({
    paymentMethod: "Cashfree",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isOnlinePayment = formData.paymentMethod !== "COD";
  const shipping = 0;
  const tax = 0;
  const discount = isOnlinePayment ? Number((subtotal * 0.05).toFixed(2)) : 0;
  const total = Number((subtotal + shipping + tax - discount).toFixed(2));

  const handleComplete = () => {
    const isCashfree = formData.paymentMethod === "Cashfree";
    const selectedAddr = addresses?.find((a) => a.id === selectedAddressId);

    if (!selectedAddr) {
      toast.error("Please select a shipping address");
      return;
    }

    createOrderMutation.mutate(
      {
        shippingName: selectedAddr.name,
        shippingPhone: selectedAddr.mobile || "0000000000",
        shippingAddress: selectedAddr.address,
        shippingCity: selectedAddr.city,
        shippingState: selectedAddr.state,
        shippingPincode: selectedAddr.pincode,
        paymentMethod: isCashfree ? "CASHFREE" : "COD",
        addressId: selectedAddr.id,
      },
      {
        onSuccess: async (data) => {
          if (isCashfree && data.cashfreeOrder) {
            const scriptLoaded = await loadCashfreeScript();
            if (!scriptLoaded) {
              toast.error("Failed to load Cashfree payment gateway. Please try again.");
              return;
            }

            try {
              const cashfree = (window as any).Cashfree({
                mode: data.cashfreeOrder.sandbox ? "sandbox" : "production",
              });

              cashfree.checkout({
                paymentSessionId: data.cashfreeOrder.paymentSessionId,
                returnUrl: `${window.location.origin}/order/${data.order.id}`,
              });
            } catch (err: any) {
              console.error("Cashfree Checkout error:", err);
              toast.error("Could not load Cashfree checkout page. Please try again.");
            }
          } else {
            setOrderNumber(data.order.orderNumber);
            setIsComplete(true);
            toast.success("Order placed successfully!");
          }
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to place order");
        },
      },
    );
  };

  if (isComplete) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 min-h-[80vh] flex items-center bg-background text-foreground w-full overflow-x-hidden">
          <div className="container-luxe max-w-md mx-auto px-3 sm:px-4 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-5 sm:p-8 text-center shadow-lg relative overflow-hidden w-full"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-success/10 rounded-full blur-2xl pointer-events-none" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-sm"
              >
                <Check className="h-7 w-7 stroke-[2.5]" />
              </motion.div>

              <h1 className="font-display text-xl sm:text-2xl font-bold mb-2 tracking-tight">
                Order Confirmed!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
                Thank you for your purchase. We've received your order and are preparing it for shipment.
              </p>

              <div className="bg-secondary/40 border border-border/80 rounded-xl p-3.5 mb-5 text-left space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Order Reference
                </span>
                <p className="font-mono text-base font-bold text-foreground tracking-wide break-all">
                  #{orderNumber}
                </p>
              </div>

              <div className="space-y-2.5">
                <Button variant="default" className="w-full h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-semibold shadow-sm" asChild>
                  <Link to="/account/orders">
                    View My Orders
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-medium border-border" asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="pt-28 pb-16 container-luxe min-h-[60vh] flex items-center justify-center bg-background text-foreground w-full px-4 overflow-x-hidden">
          <div className="text-center max-w-sm w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
              <ShoppingBag className="h-7 w-7 stroke-[1.5]" />
            </div>
            <h1 className="font-display text-lg sm:text-xl font-bold mb-1.5">Your Bag is Empty</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Explore our premium range of sports nutrition and supplements.
            </p>
            <Button className="w-full h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-semibold shadow-xs" asChild>
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-20 sm:pt-24 pb-16 bg-background text-foreground min-h-screen selection:bg-primary/20 w-full overflow-x-hidden">
        <div className="container-luxe max-w-5xl mx-auto px-3 sm:px-6 w-full min-w-0">
          
          {/* Header */}
          <div className="text-center max-w-lg mx-auto mb-5 sm:mb-8 px-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-1">
              Secure Checkout
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Complete your order in 2 simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center max-w-sm mx-auto mb-6 sm:mb-8 px-1 w-full">
            {steps.map((step, index) => {
              const isCurrent = index === currentStep;
              const isPassed = index < currentStep;
              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none min-w-0">
                  <button
                    type="button"
                    onClick={() => isPassed && setCurrentStep(index)}
                    disabled={!isPassed}
                    className={cn(
                      "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border shrink-0",
                      isCurrent
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : isPassed
                          ? "bg-secondary text-foreground border-border hover:border-primary/50 cursor-pointer"
                          : "bg-muted/40 text-muted-foreground/60 border-transparent cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0",
                        isCurrent
                          ? "bg-primary-foreground text-primary"
                          : isPassed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isPassed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : index + 1}
                    </div>
                    <span className="text-[11px] sm:text-xs whitespace-nowrap">{step.title}</span>
                  </button>

                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-1.5 sm:mx-2 rounded-full transition-colors min-w-[12px]",
                        currentStep > index ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-start w-full min-w-0">
            {/* Main Form Column */}
            <div className="lg:col-span-7 xl:col-span-8 w-full min-w-0">
              
              {/* Step 1: Shipping Address & Payment Selection */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-5 w-full min-w-0"
                >
                  {/* Shipping Address Section */}
                  <div className="bg-card border border-border/80 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4 w-full min-w-0">
                    <div className="flex justify-between items-center gap-2 pb-3 border-b border-border/60 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                            1
                          </span>
                          <h2 className="font-display text-base sm:text-lg font-bold tracking-tight truncate">
                            Shipping Address
                          </h2>
                        </div>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 ml-7 truncate">
                          Choose where you'd like your order delivered
                        </p>
                      </div>

                      <Link
                        to="/account/addresses"
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-border rounded-lg hover:border-primary text-xs font-semibold transition-all bg-secondary/50 hover:bg-secondary text-foreground flex-shrink-0 whitespace-nowrap"
                      >
                        <Plus className="h-3 w-3" />
                        Add New
                      </Link>
                    </div>

                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-8 gap-2.5 text-muted-foreground w-full">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-xs font-medium">Loading saved addresses...</span>
                      </div>
                    ) : !addresses || addresses.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-border rounded-xl bg-secondary/20 p-4 space-y-3 w-full">
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mx-auto text-muted-foreground">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold mb-0.5">No Saved Addresses Found</h3>
                          <p className="text-[11px] sm:text-xs text-muted-foreground max-w-xs mx-auto">
                            Please add a shipping address to proceed with checkout.
                          </p>
                        </div>
                        <Link
                          to="/account/addresses"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-wider font-bold rounded-lg shadow-xs hover:bg-primary/90 transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Address
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-2.5 w-full min-w-0">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={cn(
                                "p-3 sm:p-3.5 border rounded-xl cursor-pointer transition-all flex items-start gap-3 relative w-full min-w-0",
                                isSelected
                                  ? "border-primary bg-primary/[0.03] ring-1 ring-primary shadow-xs"
                                  : "border-border bg-card hover:border-border/80 hover:bg-secondary/20"
                              )}
                            >
                              <input
                                type="radio"
                                name="checkoutAddress"
                                checked={isSelected}
                                onChange={() => setSelectedAddressId(addr.id)}
                                className="mt-0.5 h-3.5 w-3.5 accent-primary cursor-pointer flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0 break-words">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  <span className="font-bold text-xs sm:text-sm text-foreground break-words">
                                    {addr.name}
                                  </span>
                                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border flex-shrink-0">
                                    {addr.type}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-normal mb-0.5 break-words">
                                  {addr.address}
                                  {addr.locality && `, ${addr.locality}`}
                                </p>
                                <p className="text-xs text-muted-foreground font-medium break-words">
                                  {addr.city}, {addr.state} - <span className="font-semibold text-foreground">{addr.pincode}</span>
                                </p>
                                <p className="text-[11px] text-muted-foreground/80 mt-0.5 font-mono">
                                  Phone: {addr.mobile}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Payment Method Section */}
                  <div className="bg-card border border-border/80 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4 w-full min-w-0">
                    <div className="pb-3 border-b border-border/60 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          2
                        </span>
                        <h2 className="font-display text-base sm:text-lg font-bold tracking-tight truncate">
                          Payment Method
                        </h2>
                      </div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 ml-7 truncate">
                        Select how you would like to pay
                      </p>
                    </div>

                    <div className="grid gap-2.5 w-full min-w-0">
                      {/* Online Payment Option */}
                      <label
                        className={cn(
                          "flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 border rounded-xl cursor-pointer transition-all justify-between relative w-full min-w-0",
                          formData.paymentMethod === "Cashfree"
                            ? "border-primary bg-primary/[0.03] ring-1 ring-primary shadow-xs"
                            : "border-border bg-card hover:border-border/80 hover:bg-secondary/20"
                        )}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Cashfree"
                            checked={formData.paymentMethod === "Cashfree"}
                            onChange={handleInputChange}
                            className="w-3.5 h-3.5 accent-primary cursor-pointer flex-shrink-0"
                          />
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs sm:text-sm block text-foreground truncate">
                              Pay Online (Instant)
                            </span>
                            <span className="text-[11px] sm:text-xs text-muted-foreground truncate block">
                              UPI, Cards, Netbanking, Wallets
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ml-1.5">
                          5% OFF
                        </span>
                      </label>

                      {/* Cash on Delivery Option */}
                      <label
                        className={cn(
                          "flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 border rounded-xl cursor-pointer transition-all justify-between relative w-full min-w-0",
                          formData.paymentMethod === "COD"
                            ? "border-primary bg-primary/[0.03] ring-1 ring-primary shadow-xs"
                            : "border-border bg-card hover:border-border/80 hover:bg-secondary/20"
                        )}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={formData.paymentMethod === "COD"}
                            onChange={handleInputChange}
                            className="w-3.5 h-3.5 accent-primary cursor-pointer flex-shrink-0"
                          />
                          <div className="w-8 h-8 rounded-lg bg-secondary text-foreground flex items-center justify-center flex-shrink-0">
                            <Truck className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs sm:text-sm block text-foreground truncate">
                              Cash on Delivery (COD)
                            </span>
                            <span className="text-[11px] sm:text-xs text-muted-foreground truncate block">
                              Pay in cash or UPI upon delivery
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Step 1 Action Button */}
                  <Button
                    size="lg"
                    className="w-full h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                    onClick={() => {
                      if (!selectedAddressId) {
                        toast.error("Please select a shipping address to continue");
                        return;
                      }
                      setCurrentStep(1);
                    }}
                  >
                    Continue to Order Review
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Order Review & Final Place Order */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-5 w-full min-w-0"
                >
                  <div className="bg-card border border-border/80 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-4 w-full min-w-0">
                    <div className="pb-3 border-b border-border/60 flex items-center justify-between gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <h2 className="font-display text-base sm:text-lg font-bold tracking-tight truncate">
                          Review Your Order
                        </h2>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                          Please verify your delivery address and payment choice
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentStep(0)}
                        className="text-xs font-bold text-primary hover:underline flex-shrink-0"
                      >
                        Edit Details
                      </button>
                    </div>

                    {/* Summary Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
                      {/* Delivery Address Summary */}
                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/60 space-y-1 min-w-0 break-words">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span>Delivery Address</span>
                        </div>
                        {(() => {
                          const addr = addresses?.find((a) => a.id === selectedAddressId);
                          if (!addr) return <p className="text-xs text-muted-foreground">No address selected</p>;
                          return (
                            <div className="text-xs text-muted-foreground space-y-0.5 leading-normal break-words">
                              <p className="font-bold text-foreground text-xs sm:text-sm break-words">{addr.name}</p>
                              <p className="break-words">{addr.address}{addr.locality ? `, ${addr.locality}` : ""}</p>
                              <p className="break-words">{addr.city}, {addr.state} - <span className="font-semibold text-foreground">{addr.pincode}</span></p>
                              <p className="text-[11px] font-mono text-muted-foreground/80 pt-0.5">Phone: {addr.mobile}</p>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Payment Method Summary */}
                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/60 space-y-1 min-w-0 break-words">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                          {formData.paymentMethod === "Cashfree" ? (
                            <CreditCard className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          ) : (
                            <Truck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          )}
                          <span>Payment Method</span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5 leading-normal break-words">
                          <p className="font-bold text-foreground text-xs sm:text-sm">
                            {formData.paymentMethod === "Cashfree"
                              ? "Online Payment"
                              : "Cash on Delivery (COD)"}
                          </p>
                          <p>
                            {formData.paymentMethod === "Cashfree"
                              ? "UPI, Cards, Netbanking via Cashfree Gateway"
                              : "Pay cash or scan QR upon delivery"}
                          </p>
                          {formData.paymentMethod === "Cashfree" && (
                            <div className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 mt-1">
                              5% Extra Discount Applied
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-2.5 pt-1 w-full min-w-0">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Items in this Order ({items.length})
                      </h3>
                      <div className="divide-y divide-border/60 w-full min-w-0">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="py-2.5 first:pt-0 last:pb-0 flex gap-2.5 sm:gap-3 items-center min-w-0"
                          >
                            <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden border border-border/80 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                                {item.name}
                              </p>
                              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                                {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
                                  .filter(Boolean)
                                  .join(" • ") || "Default"}
                              </p>
                              <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0 pl-1">
                              <span className="font-semibold text-xs sm:text-sm text-foreground">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 2 Action Buttons */}
                  <div className="flex gap-2.5 sm:gap-3 w-full">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold border-border bg-card hover:bg-secondary flex-shrink-0"
                      onClick={() => setCurrentStep(0)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all min-w-0"
                      onClick={handleComplete}
                      disabled={
                        createOrderMutation.isPending ||
                        verifyPaymentMutation.isPending
                      }
                    >
                      {createOrderMutation.isPending ||
                      verifyPaymentMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
                          <span className="truncate">
                            {verifyPaymentMutation.isPending
                              ? "Verifying Payment..."
                              : "Placing Order..."}
                          </span>
                        </>
                      ) : (
                        <span className="truncate">
                          Place Order • ₹{total.toLocaleString("en-IN")}
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar: Order Summary Card */}
            <div className="lg:col-span-5 xl:col-span-4 w-full min-w-0 lg:sticky lg:top-24 space-y-3">
              <div className="bg-card border border-border/80 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4 w-full min-w-0">
                <h2 className="font-display text-sm sm:text-base font-bold tracking-tight pb-2.5 border-b border-border/60">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-muted-foreground gap-2">
                    <span className="truncate">Bag Total</span>
                    <span className="font-medium text-foreground flex-shrink-0">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground items-center gap-2">
                    <span className="truncate">Shipping Charges</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
                      FREE
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold items-center gap-2">
                      <span className="flex items-center gap-1 truncate">
                        <Sparkles className="w-3 h-3 flex-shrink-0" />
                        Online Pay (5% OFF)
                      </span>
                      <span className="flex-shrink-0">- ₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {tax > 0 && (
                    <div className="flex justify-between text-muted-foreground gap-2">
                      <span className="truncate">Estimated Taxes</span>
                      <span className="font-medium text-foreground flex-shrink-0">₹{tax}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border/80 flex justify-between items-baseline gap-2">
                    <div className="min-w-0">
                      <span className="font-display text-xs sm:text-sm font-bold text-foreground block truncate">
                        Total Amount
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Inclusive of all taxes
                      </span>
                    </div>
                    <span className="font-display text-lg sm:text-xl font-bold text-foreground tracking-tight flex-shrink-0">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Secure Guarantee */}
                <div className="pt-2.5 border-t border-border/60 flex items-center gap-2.5 text-muted-foreground">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-foreground">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] leading-tight min-w-0">
                    <p className="font-semibold text-foreground truncate">100% Safe & Secure Payments</p>
                    <p className="text-muted-foreground mt-0.5 truncate">End-to-end encrypted transactions</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
