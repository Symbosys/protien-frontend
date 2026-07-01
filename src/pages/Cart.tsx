import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  const shipping = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <MainLayout>
      <div className="pt-32 pb-16">
        <div className="container-luxe">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#2C2C2C] font-normal tracking-wide mb-8">
            Shopping Bag
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-[#E5E5E5] mb-4 stroke-[1]" />
              <h2 className="text-xl font-display text-[#2C2C2C] mb-2 tracking-wide">Your bag is empty</h2>
              <p className="text-[10px] uppercase tracking-widest text-[#888] mb-8">
                Start shopping to add items to your bag
              </p>
              <Link 
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#2C2C2C] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#d4af37] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 py-6 border-b border-[#E5E5E5] last:border-0"
                  >
                    <Link
                      to={`/product/${item.productId}`}
                      className="w-24 h-32 bg-[#FAF9F6] border border-[#E5E5E5] p-1 flex-shrink-0"
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
                          <h3 className="font-display text-lg text-[#2C2C2C] hover:text-[#d4af37] transition-colors tracking-wide">
                            {item.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-[#888] hover:text-[#d4af37] transition-colors"
                        >
                          <X className="h-4 w-4 stroke-[1.5]" />
                        </button>
                      </div>

                      <p className="text-[10px] uppercase tracking-widest text-[#888] mb-4">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' / '}
                        {item.color && `Color: ${item.color}`}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#E5E5E5] h-10">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 h-full flex items-center text-[#888] hover:text-[#d4af37] transition-colors"
                          >
                            <Minus className="h-3 w-3 stroke-[1.5]" />
                          </button>
                          <span className="px-3 text-[#2C2C2C] text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 h-full flex items-center text-[#888] hover:text-[#d4af37] transition-colors"
                          >
                            <Plus className="h-3 w-3 stroke-[1.5]" />
                          </button>
                        </div>

                        <span className="font-medium text-[#2C2C2C]">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-32 self-start">
                <div className="bg-[#FAF9F6] border border-[#E5E5E5] p-8">
                  <h2 className="font-display text-2xl text-[#2C2C2C] mb-6 tracking-wide">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#555]">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="text-[#2C2C2C]">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#555]">
                      <span>Shipping</span>
                      <span className="text-[#2C2C2C]">{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[10px] text-[#888]">
                        Free shipping on orders over $500
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between font-display text-xl text-[#2C2C2C] py-6 border-t border-[#E5E5E5]">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 px-4 border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#2C2C2C] transition-colors"
                      />
                      <button className="px-6 border border-[#E5E5E5] bg-white text-[#2C2C2C] text-[10px] uppercase tracking-[0.2em] hover:border-[#2C2C2C] transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  <Link 
                    to="/checkout"
                    className="flex items-center justify-center w-full py-4 bg-[#2C2C2C] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#d4af37] transition-colors group"
                  >
                    Checkout
                    <ArrowRight className="h-4 w-4 ml-2 stroke-[1.5] transition-transform group-hover:translate-x-1" />
                  </Link>

                  <p className="text-[10px] uppercase tracking-widest text-[#888] text-center mt-6">
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
