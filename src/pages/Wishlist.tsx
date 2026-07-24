import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { items, removeItem, isLoading } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: (typeof items)[0]) => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center pt-28">
          <div className="text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-black mx-auto" />
            <p className="text-sm text-gray-400">Loading your wishlist…</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F8FA] text-black pb-20">

        {/* Hero */}
        <div className="bg-white border-b border-gray-100 pt-28 pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center gap-2.5">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                Wishlist
              </h1>
            </div>
            {items.length > 0 && (
              <p className="text-xs font-semibold text-gray-400 pb-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center py-24 bg-white border border-dashed border-gray-200 rounded-2xl"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-5">
                <Heart className="w-7 h-7 text-rose-400" />
              </div>
              <h2 className="text-lg font-bold text-black mb-1">Your wishlist is empty</h2>
              <p className="text-sm text-gray-400 mb-7 max-w-xs">
                Save products you love and come back to them anytime.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-900 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Explore Products
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                        title="Remove from wishlist"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Add to bag overlay */}
                      <motion.button
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 py-2.5 bg-black/90 text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Bag
                      </motion.button>
                    </div>

                    {/* Info */}
                    <div className="p-3.5">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-sm font-semibold text-black line-clamp-1 hover:underline mb-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm font-bold text-black">₹{item.price.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}
