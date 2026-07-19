import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const shipping = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    setUpdatingItemId(itemId);
    try {
      await updateQuantity(itemId, newQty);
    } catch (err) {
      // Handled by context
    } finally {
      setUpdatingItemId(null);
    }
  };

  return (
    <MainLayout>
      <div className="pt-32 pb-16 bg-[#FAF9F6] text-black min-h-screen">
        <div className="container-luxe">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-black font-normal tracking-wide mb-8">
            Shopping Bag
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4 stroke-[1]" />
              <h2 className="text-xl font-display text-black mb-2 tracking-wide">Your bag is empty</h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-8">
                Start shopping to add items to your bag
              </p>
              <Link 
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#d4af37] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 py-6 border-b border-gray-100 last:border-0 bg-white"
                  >
                    <Link
                      to={`/product/${item.productId}`}
                      className="w-24 h-32 bg-[#FAF9F6] border border-gray-100 p-1 flex-shrink-0 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <Link to={`/product/${item.productId}`}>
                          <h3 className="font-display text-lg text-black hover:text-[#d4af37] transition-colors tracking-wide">
                            {item.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-gray-400 hover:text-[#d4af37] transition-colors"
                        >
                          <X className="h-4 w-4 stroke-[1.5]" />
                        </button>
                      </div>

                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">
                        {item.variant?.attributeValues && item.variant.attributeValues.length > 0
                          ? item.variant.attributeValues.map((av: any) => `${av.attribute?.name || 'Option'}: ${av.value}`).join(' / ')
                          : [
                              item.size && `Size: ${item.size}`,
                              item.color && `Color: ${item.color}`
                            ].filter(Boolean).join(' / ')}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 h-10 rounded bg-white">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updatingItemId === item.id}
                            className="px-3 h-full flex items-center text-gray-400 hover:text-[#d4af37] disabled:opacity-50 transition-colors"
                          >
                            <Minus className="h-3 w-3 stroke-[1.5]" />
                          </button>
                          <span className="px-3 text-black text-sm min-w-[32px] text-center flex items-center justify-center">
                            {updatingItemId === item.id ? (
                              <Loader2 className="h-4.5 w-4.5 animate-spin text-gray-500" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updatingItemId === item.id}
                            className="px-3 h-full flex items-center text-gray-400 hover:text-[#d4af37] disabled:opacity-50 transition-colors"
                          >
                            <Plus className="h-3 w-3 stroke-[1.5]" />
                          </button>
                        </div>

                        <span className="font-medium text-black">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-32 self-start">
                <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                  <h2 className="font-display text-2xl text-black mb-6 tracking-wide">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-600">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="text-black">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-600">
                      <span>Shipping</span>
                      <span className="text-black">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[10px] text-gray-400">
                        Free shipping on orders over ₹500
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between font-display text-xl text-black py-6 border-t border-gray-100">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 px-4 border border-gray-200 bg-white text-sm focus:outline-none focus:border-black transition-colors"
                      />
                      <button className="px-6 border border-gray-200 bg-white text-black text-[10px] uppercase tracking-[0.2em] hover:border-black transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  <Link 
                    to="/checkout"
                    className="flex items-center justify-center w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#d4af37] transition-colors group"
                  >
                    Checkout
                    <ArrowRight className="h-4 w-4 ml-2 stroke-[1.5] transition-transform group-hover:translate-x-1" />
                  </Link>

                  <p className="text-[10px] uppercase tracking-widest text-gray-400 text-center mt-6">
                    Taxes calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
