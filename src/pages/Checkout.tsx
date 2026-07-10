import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Truck, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { useCreateOrderMutation, useVerifyPaymentMutation } from '@/api/hooks/order.hooks';
import { toast } from 'sonner';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'Razorpay',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const shipping = subtotal >= 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const handleComplete = () => {
    const isRazorpay = formData.paymentMethod === 'Razorpay';
    
    createOrderMutation.mutate(
      {
        shippingName: `${formData.firstName} ${formData.lastName}`.trim(),
        shippingPhone: formData.phone || "0000000000",
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingState: formData.state,
        shippingPincode: formData.pincode,
        paymentMethod: isRazorpay ? 'RAZORPAY' : 'COD',
      },
      {
        onSuccess: async (data) => {
          if (isRazorpay && data.razorpayOrder) {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
              toast.error("Failed to load Razorpay payment gateway. Please try again.");
              return;
            }

            const options = {
              key: data.razorpayOrder.key,
              amount: data.razorpayOrder.amount,
              currency: data.razorpayOrder.currency,
              name: "Protein Luxe Store",
              description: `Payment for Order ${data.order.orderNumber}`,
              order_id: data.razorpayOrder.id,
              handler: function (response: any) {
                verifyPaymentMutation.mutate(
                  {
                    orderId: data.order.id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  },
                  {
                    onSuccess: (confirmedOrder) => {
                      setOrderNumber(confirmedOrder.orderNumber);
                      setIsComplete(true);
                      clearCart();
                      toast.success("Payment verified and order placed successfully!");
                    },
                    onError: (err: any) => {
                      toast.error(err.response?.data?.message || "Payment verification failed.");
                    },
                  }
                );
              },
              prefill: {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                contact: formData.phone,
              },
              theme: {
                color: "#000000",
              },
              modal: {
                ondismiss: function () {
                  toast.warning("Payment cancelled by user.");
                },
              },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
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
                  <h2 className="font-display text-xl mb-6">Shipping Address</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-md bg-transparent focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full mt-8"
                    onClick={() => {
                      if (!formData.firstName || !formData.address || !formData.city || !formData.state || !formData.pincode) {
                        toast.error("Please fill in all shipping details");
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
                    <label className={cn("flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors", formData.paymentMethod === 'Razorpay' ? "border-foreground" : "border-border hover:border-foreground/50")}>
                      <input type="radio" name="paymentMethod" value="Razorpay" checked={formData.paymentMethod === 'Razorpay'} onChange={handleInputChange} className="w-4 h-4" />
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
