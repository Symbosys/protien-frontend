import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Truck, MapPin, ChevronRight, Loader2, Plus } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { useCreateOrderMutation, useVerifyPaymentMutation } from '@/api/hooks/order.hooks';
import { useAddressesQuery } from '@/api/hooks/address.hooks';
import { toast } from 'sonner';

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
  { id: 'shipping', title: 'Shipping', icon: MapPin },
  { id: 'payment', title: 'Payment', icon: CreditCard },
  { id: 'review', title: 'Review', icon: Check },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { items, subtotal, clearCart } = useCart();
  
  const createOrderMutation = useCreateOrderMutation();
  const verifyPaymentMutation = useVerifyPaymentMutation();
  const { data: addresses, isLoading } = useAddressesQuery();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const [formData, setFormData] = useState({
    paymentMethod: 'Cashfree',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const shipping = subtotal >= 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const handleComplete = () => {
    const isCashfree = formData.paymentMethod === 'Cashfree';
    const selectedAddr = addresses?.find(a => a.id === selectedAddressId);
    
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
        paymentMethod: isCashfree ? 'CASHFREE' : 'COD',
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
                mode: data.cashfreeOrder.sandbox ? "sandbox" : "production"
              });

              cashfree.checkout({
                paymentSessionId: data.cashfreeOrder.paymentSessionId,
                returnUrl: `${window.location.origin}/order/${data.order.id}`
              });
            } catch (err: any) {
              console.error("Cashfree Checkout error:", err);
              toast.error("Could not load Cashfree checkout page. Please try again.");
            }
          } else {
            setOrderNumber(data.order.orderNumber);
            setIsComplete(true);
            clearCart();
            toast.success("Order placed successfully!");
          }
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to place order");
        },
      }
    );
  };


  if (isComplete) {
    return (
      <MainLayout>
        <div className="pt-32 pb-16 min-h-screen flex items-center">
          <div className="container-luxe">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-8 rounded-full bg-success/10 flex items-center justify-center"
              >
                <Check className="h-10 w-10 text-success" />
              </motion.div>
              <h1 className="font-display text-3xl md:text-4xl mb-4">Order Confirmed</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your order! We've sent a confirmation email with your order details.
              </p>
              <div className="bg-secondary/30 rounded-lg p-6 mb-8">
                <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                <p className="font-display text-xl">#{orderNumber}</p>
              </div>
              <Button variant="hero" size="lg" asChild>
                <Link to="/account/orders">View My Orders</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="pt-32 pb-16 container-luxe text-center">
          <h1 className="font-display text-2xl mb-4">Your cart is empty</h1>
          <Button variant="hero" asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-32 pb-16">
        <div className="container-luxe">
          <h1 className="font-display text-3xl md:text-4xl mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                    index === currentStep
                      ? "bg-foreground text-background"
                      : index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-2">
              {/* Shipping Step */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-display text-xl">Shipping Address</h2>
                    <Link
                      to="/account/addresses"
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg hover:border-foreground text-xs font-semibold transition-colors bg-white text-black"
                    >
                      <Plus className="h-4 w-4" />
                      Add Address
                    </Link>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center gap-2 py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Loading saved addresses...</span>
                    </div>
                  ) : !addresses || addresses.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-card p-6">
                      <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-foreground mb-1">No Saved Addresses Found</h3>
                      <p className="text-xs text-muted-foreground mb-6">
                        You need to add at least one shipping address to proceed.
                      </p>
                      <Link
                        to="/account/addresses"
                        className="inline-flex items-center gap-1.5 px-6 py-3 bg-foreground hover:bg-foreground/90 text-background text-xs uppercase tracking-wider font-bold rounded-lg shadow transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add New Address
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={cn(
                            "p-5 border rounded-xl cursor-pointer bg-white text-black transition-all shadow-sm flex items-start gap-4",
                            selectedAddressId === addr.id
                              ? "border-black ring-2 ring-black/5"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <input
                            type="radio"
                            name="checkoutAddress"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1 h-4 w-4 text-black accent-black"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-semibold text-sm text-black">{addr.name}</span>
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                                {addr.type}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/5 text-black border border-black/10">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1 leading-relaxed">
                              {addr.address}
                              {addr.locality && `, ${addr.locality}`}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              {addr.city}, {addr.state} - <span className="font-semibold">{addr.pincode}</span>
                            </p>
                            <p className="text-xs text-gray-400 font-medium">
                              Phone: {addr.mobile}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full mt-8 bg-black text-white hover:bg-black/90"
                    onClick={() => {
                      if (!selectedAddressId) {
                        toast.error("Please select a shipping address");
                        return;
                      }
                      setCurrentStep(1);
                    }}
                  >
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {/* Payment Step */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-xl mb-6">Payment Method</h2>

                  <div className="space-y-4">
                    <label className={cn("flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors", formData.paymentMethod === 'Cashfree' ? "border-foreground" : "border-border hover:border-foreground/50")}>
                      <input type="radio" name="paymentMethod" value="Cashfree" checked={formData.paymentMethod === 'Cashfree'} onChange={handleInputChange} className="w-4 h-4" />
                      <CreditCard className="h-5 w-5" />
                      <span>Pay Online (UPI, Cards, Netbanking)</span>
                    </label>
                    <label className={cn("flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors", formData.paymentMethod === 'COD' ? "border-foreground" : "border-border hover:border-foreground/50")}>
                      <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleInputChange} className="w-4 h-4" />
                      <Truck className="h-5 w-5" />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>



                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" size="lg" onClick={() => setCurrentStep(0)}>
                      Back
                    </Button>
                    <Button
                      variant="hero"
                      size="lg"
                      className="flex-1"
                      onClick={() => setCurrentStep(2)}
                    >
                      Review Order
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Review Step */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-xl mb-6">Review Your Order</h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.size} / {item.color} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      variant="hero"
                      size="lg"
                      className="flex-1"
                      onClick={handleComplete}
                      disabled={createOrderMutation.isPending || verifyPaymentMutation.isPending}
                    >
                      {createOrderMutation.isPending || verifyPaymentMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {verifyPaymentMutation.isPending ? "Verifying Payment..." : "Placing Order..."}
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-32 self-start">
              <div className="bg-secondary/30 rounded-lg p-6">
                <h2 className="font-display text-xl mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{tax}</span>
                  </div>
                </div>

                <div className="flex justify-between font-medium text-lg py-4 border-t border-border">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
