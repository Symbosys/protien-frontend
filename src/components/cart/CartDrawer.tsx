import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white text-black z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-display text-xl">Shopping Bag</h2>
                <span className="text-sm text-gray-500">
                  ({itemCount})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium mb-2 text-black">Your bag is empty</p>
                <p className="text-sm text-gray-500 text-center mb-6">
                  Discover our curated collection of luxury essentials
                </p>
                <Button onClick={closeCart} variant="hero" className="bg-black hover:bg-black/90 text-white" asChild>
                  <Link to="/products">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 bg-white"
                    >
                      <div className="w-24 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-medium text-sm text-black">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-gray-100 text-gray-400 hover:text-black rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.variant?.attributeValues && item.variant.attributeValues.length > 0
                            ? item.variant.attributeValues.map((av: any) => `${av.attribute?.name || 'Option'}: ${av.value}`).join(' / ')
                            : [
                                item.size && `Size: ${item.size}`,
                                item.color && `Color: ${item.color}`
                              ].filter(Boolean).join(' / ')}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded-md bg-white h-8">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={updatingItemId === item.id}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 text-gray-600 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-sm min-w-[24px] text-center text-black flex items-center justify-center">
                              {updatingItemId === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={updatingItemId === item.id}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 text-gray-600 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
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

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-white space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-black">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Shipping and taxes calculated at checkout
                  </p>
                  <div className="space-y-3">
                    <Button variant="hero" className="w-full bg-black hover:bg-black/90 text-white" size="lg" asChild>
                      <Link to="/checkout" onClick={closeCart}>
                        Checkout
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-200 hover:bg-gray-50 text-black bg-white"
                      onClick={closeCart}
                      asChild
                    >
                      <Link to="/cart">View Bag</Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
