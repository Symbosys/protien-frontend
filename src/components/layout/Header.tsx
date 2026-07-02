"use client";

import { useCategoriesQuery } from '@/api/hooks/category.hooks';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { categories as mockCategories } from '@/data/products';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart, itemCount } = useCart();
  const { items } = useWishlist();
  const location = useLocation();

  const { data: categoriesData } = useCategoriesQuery({ limit: 100 });
  const categoriesList = categoriesData?.categories && categoriesData.categories.length > 0
    ? categoriesData.categories.map(cat => ({
        name: cat.name,
      }))
    : mockCategories;

  const isHomePage = location.pathname === '/';

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 shadow-sm"
      )}>
        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            
            {/* Left: Mobile Menu Button & Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-black hover:text-[#5BBF3D]"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <span className="font-display text-lg lg:text-xl font-black tracking-wider text-black group-hover:text-[#5BBF3D] transition-colors uppercase">
                  PROTEIN & NUTRIENTS
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link 
                to="/" 
                className="text-xs uppercase font-bold tracking-wider text-black hover:text-[#5BBF3D] transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-xs uppercase font-bold tracking-wider text-black hover:text-[#5BBF3D] transition-colors"
              >
                Our Story
              </Link>

              {/* Supplements Megamenu */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveCategory('supplements')}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to="/products"
                  className="flex items-center gap-1 py-2 text-xs uppercase font-bold tracking-wider text-black hover:text-[#5BBF3D] transition-colors"
                >
                  Supplements
                  <ChevronDown className="h-3.5 w-3.5 text-[#8CFF64]" />
                </Link>

                <AnimatePresence>
                  {activeCategory === 'supplements' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                    >
                      <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-5 min-w-[260px]">
                        <ul className="space-y-2">
                          {categoriesList.map((cat) => (
                            <li key={cat.name}>
                              <Link
                                to={`/products?category=${cat.name}`}
                                className="text-xs uppercase font-semibold text-gray-700 hover:text-[#5BBF3D] flex justify-between items-center transition-colors py-1"
                              >
                                {cat.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* More dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveCategory('more')}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <span className="flex items-center gap-1 py-2 text-xs uppercase font-bold tracking-wider text-black hover:text-[#5BBF3D] cursor-pointer transition-colors">
                  More
                  <ChevronDown className="h-3.5 w-3.5 text-[#8CFF64]" />
                </span>

                <AnimatePresence>
                  {activeCategory === 'more' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 pt-2 z-50"
                    >
                      <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-4 min-w-[200px] space-y-2">
                        <Link to="/reviews" className="block text-xs uppercase font-semibold text-gray-700 hover:text-[#5BBF3D] transition-colors py-1">
                          Customer Reviews
                        </Link>
                        <Link to="/stores" className="block text-xs uppercase font-semibold text-gray-700 hover:text-[#5BBF3D] transition-colors py-1">
                          Store Locator
                        </Link>
                        <Link to="/support" className="block text-xs uppercase font-semibold text-gray-700 hover:text-[#5BBF3D] transition-colors py-1">
                          Customer Support
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 lg:gap-4 text-black">
              {/* Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:text-[#5BBF3D] transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 stroke-[2]" />
              </button>

              {/* Wishlist */}
              <Link 
                to="/wishlist"
                className="p-2 hover:text-[#5BBF3D] transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 stroke-[2]" />
                {items && items.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#8CFF64] text-black text-[8px] font-bold flex items-center justify-center border border-white">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button 
                onClick={openCart}
                className="p-2 hover:text-[#5BBF3D] transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5 stroke-[2]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#8CFF64] text-black text-[8px] font-bold flex items-center justify-center border border-white">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Login/Account */}
              <Link 
                to="/account"
                className="p-2 hover:text-[#5BBF3D] transition-colors hidden sm:inline-block"
                aria-label="Account"
              >
                <User className="h-5 w-5 stroke-[2]" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to push content below fixed header */}
      <div className="h-[60px] lg:h-[72px]" />

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-xs bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <span className="font-display text-lg font-black text-black uppercase">P&N</span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2">
                    <X className="h-6 w-6 text-black" />
                  </button>
                </div>

                <nav className="space-y-4">
                  <Link
                    to="/"
                    className="text-sm font-bold uppercase block py-2 text-black hover:text-[#5BBF3D]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="text-sm font-bold uppercase block py-2 text-black hover:text-[#5BBF3D]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Our Story
                  </Link>

                  <div className="py-2">
                    <span className="text-sm font-bold uppercase block mb-3 text-black">
                      Categories
                    </span>
                    <ul className="space-y-2 pl-3 border-l-2 border-[#8CFF64]">
                      {categoriesList.map((cat) => (
                        <li key={cat.name}>
                          <Link
                            to={`/products?category=${cat.name}`}
                            className="text-xs uppercase font-semibold text-gray-500 hover:text-[#5BBF3D] block py-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/stores"
                    className="text-sm font-bold uppercase block py-2 text-black hover:text-[#5BBF3D]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Store Locator
                  </Link>
                  <Link
                    to="/support"
                    className="text-sm font-bold uppercase block py-2 text-black hover:text-[#5BBF3D]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Support
                  </Link>
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                  <Link to="/account" className="flex items-center gap-3 text-sm font-medium text-black" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-5 w-5" /> Account Profile
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-3 text-sm font-medium text-black" onClick={() => setIsMenuOpen(false)}>
                    <Heart className="h-5 w-5" /> My Wishlist
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex items-start justify-center pt-24"
          >
            <div className="w-full max-w-2xl px-6 relative">
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-0 right-6 p-2 text-black hover:text-[#5BBF3D]"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="relative border-b-2 border-black py-2">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 text-black" />
                <input
                  type="text"
                  placeholder="Search Supplements..."
                  className="w-full bg-transparent py-3 pl-10 text-xl font-display text-foreground placeholder-muted-foreground outline-none"
                  autoFocus
                />
              </div>
              <div className="mt-6">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-3">Popular Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {['Whey Protein', 'Creatine', 'Pre Workout', 'Multivitamins', 'BCAA', 'Peanut Butter', 'Fish Oil'].map((term) => (
                    <Link
                      key={term}
                      to={`/products?search=${term}`}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 hover:border-[#8CFF64] hover:bg-[#8CFF64]/10 hover:text-black rounded-full text-xs font-semibold transition-colors"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
