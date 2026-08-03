"use client";

import { useCategoriesQuery } from "@/api/hooks/category.hooks";
import { useProductsQuery } from "@/api/hooks/product.hooks";
import { apiClient } from "@/api/apiclient/apiClient";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { categories as mockCategories } from "@/data/products";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  Gift,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { openCart, itemCount } = useCart();
  const { items } = useWishlist();
  const location = useLocation();

  const { data: categoriesData } = useCategoriesQuery({ limit: 1000 });

  // Query dynamic products live from backend when search input >= 2 chars
  const trimmedSearch = searchVal.trim();
  const { data: searchResultsData, isLoading: isSearchLoading } =
    useProductsQuery(
      { search: trimmedSearch, limit: 6 },
      trimmedSearch.length >= 2 && (isSearchFocused || isMobileSearchFocused),
    );

  const searchProducts = searchResultsData?.products || [];

  const categoriesList =
    categoriesData?.categories && categoriesData.categories.length > 0
      ? categoriesData.categories.map((cat) => ({
          name: cat.name,
        }))
      : mockCategories;

  const isHomePage = location.pathname === "/";

  const goalsList = [
    { name: "Muscle Building", slug: "Muscle Building" },
    { name: "Weight Loss", slug: "Weight Loss" },
    { name: "Recovery & Strength", slug: "Recovery" },
    { name: "General Wellness", slug: "Wellness" },
  ];

  const processImageUrl = (url: string | null | undefined) => {
    if (!url)
      return "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=300&auto=format&fit=crop";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:") ||
      url.startsWith("blob:")
    )
      return url;

    const clientBaseUrl = apiClient.defaults.baseURL || "";
    const baseUrl =
      clientBaseUrl.replace("/api", "") || "http://192.168.1.2:4000";

    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setIsSearchFocused(false);
      setIsMobileSearchFocused(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#B5E12E] transition-all duration-300">
        {/* Top Promo Banner - Infinite Scroll LTR */}
        <div className="w-full overflow-hidden bg-[#B5E12E] py-3 text-black text-xs md:text-sm font-bold relative z-50">
          <div className="animate-scroll-ltr flex">
            {/* First scroll track container */}
            <div className="flex shrink-0 items-center justify-around gap-12 px-6 min-w-full">
              <span>Free delivery all over india</span>
              <span className="flex items-center gap-1.5 justify-center">
                <Gift className="h-4 w-4" />
                5% off on all prepaid orders use code prepaid5
              </span>
              <span>Free delivery all over india</span>
              <span className="flex items-center gap-1.5 justify-center">
                <Gift className="h-4 w-4" />
                5% off on all prepaid orders use code prepaid5
              </span>
            </div>
            {/* Second scroll track container (must be identical for seamless loop) */}
            <div className="flex shrink-0 items-center justify-around gap-12 px-6 min-w-full">
              <span>Free delivery all over india</span>
              <span className="flex items-center gap-1.5 justify-center">
                <Gift className="h-4 w-4" />
                5% off on all prepaid orders use code prepaid5
              </span>
              <span>Free delivery all over india</span>
              <span className="flex items-center gap-1.5 justify-center">
                <Gift className="h-4 w-4" />
                5% off on all prepaid orders use code prepaid5
              </span>
            </div>
          </div>
        </div>

        {/* Main Header Container with rounded-t corners */}
        <div className="bg-white rounded-t-[24px] lg:rounded-t-[32px] w-full px-4 lg:px-8 py-3.5 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-black hover:text-[#8CFF64]"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo - Highlighted & Prominent */}
              <Link to="/" className="flex items-center group flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Fuel & Nutrients Logo"
                  className="h-[56px] lg:h-[72px] w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.18)] filter brightness-[1.03] contrast-[1.05] transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link
                to="/"
                className={cn(
                  "text-sm font-bold tracking-wide transition-all relative pb-0.5",
                  isHomePage
                    ? "text-black border-b-2 border-[#8CFF64]"
                    : "text-black hover:text-[#8CFF64]",
                )}
              >
                Home
              </Link>

              {/* Shop Megamenu Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveCategory("shop")}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to="/products"
                  className="flex items-center gap-0.5 py-2 text-sm font-bold tracking-wide text-black hover:text-[#8CFF64] transition-colors"
                >
                  Shop
                  <ChevronDown className="h-4 w-4" />
                </Link>

                <AnimatePresence>
                  {activeCategory === "shop" && (
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
                                to={`/products?category=${encodeURIComponent(cat.name)}`}
                                className="text-xs uppercase font-semibold text-gray-700 hover:text-[#8CFF64] flex justify-between items-center transition-colors py-1"
                                onClick={() => setActiveCategory(null)}
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

              {/* Shop by Goal Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveCategory("goal")}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <span className="flex items-center gap-0.5 py-2 text-sm font-bold tracking-wide text-black hover:text-[#8CFF64] cursor-pointer transition-colors">
                  Shop by Goal
                  <ChevronDown className="h-4 w-4" />
                </span>

                <AnimatePresence>
                  {activeCategory === "goal" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                    >
                      <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-5 min-w-[220px]">
                        <ul className="space-y-2">
                          {goalsList.map((goal) => (
                            <li key={goal.name}>
                              <Link
                                to={`/products?goal=${encodeURIComponent(goal.slug)}`}
                                className="text-xs uppercase font-semibold text-gray-700 hover:text-[#8CFF64] flex justify-between items-center transition-colors py-1"
                                onClick={() => setActiveCategory(null)}
                              >
                                {goal.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shop by Brand */}
              <Link
                to="/products"
                className="text-sm font-bold tracking-wide text-black hover:text-[#8CFF64] transition-colors"
              >
                Shop by Brand
              </Link>
            </nav>

            {/* Right: Search, Account, Wishlist, Cart */}
            <div className="flex items-center gap-1.5 lg:gap-3 text-black">
              {/* Desktop Dynamic Live Search */}
              <div ref={searchRef} className="relative hidden md:block">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 max-w-[200px] xl:max-w-[260px] focus-within:border-[#8CFF64] focus-within:bg-white transition-all"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent text-xs xl:text-sm text-black placeholder-gray-400 outline-none w-full font-medium"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                  />
                  {searchVal ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchVal("");
                        setIsSearchFocused(false);
                      }}
                      className="p-1 text-gray-400 hover:text-black transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="p-1 hover:text-[#8CFF64] transition-colors flex-shrink-0"
                    >
                      <Search className="h-4 w-4 text-black" />
                    </button>
                  )}
                </form>

                {/* Live Search Popup Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && searchVal.trim().length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-[320px] xl:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-2"
                    >
                      {isSearchLoading ? (
                        <div className="p-4 text-center text-xs font-semibold text-gray-400 flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-[#8CFF64] rounded-full animate-spin" />
                          Searching products...
                        </div>
                      ) : searchProducts.length > 0 ? (
                        <div>
                          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 flex justify-between items-center">
                            <span>Products ({searchProducts.length})</span>
                            <span className="text-[10px] text-[#5BBF3D] font-semibold">
                              Live Results
                            </span>
                          </div>
                          <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-50 py-1">
                            {searchProducts.map((product) => {
                              const img = processImageUrl(product.image);
                              const displayPrice =
                                product.discountPrice || product.price;
                              return (
                                <Link
                                  key={product.id}
                                  to={`/product/${product.id}`}
                                  onClick={() => {
                                    setIsSearchFocused(false);
                                    setSearchVal("");
                                  }}
                                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors group"
                                >
                                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                    <img
                                      src={img}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-black truncate group-hover:text-[#5BBF3D] transition-colors">
                                      {product.name}
                                    </h4>
                                    <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                                      ₹
                                      {Number(displayPrice).toLocaleString(
                                        "en-IN",
                                      )}
                                      {product.discountPrice && (
                                        <span className="line-through text-gray-400 ml-1.5 text-[10px]">
                                          ₹
                                          {Number(product.price).toLocaleString(
                                            "en-IN",
                                          )}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                          <button
                            onClick={handleSearchSubmit}
                            className="w-full py-2 bg-gray-50 hover:bg-[#8CFF64] hover:text-black text-xs font-bold text-center text-gray-700 transition-colors rounded-xl mt-1 block"
                          >
                            View all results for "{searchVal}" →
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-xs text-gray-500">
                          No products found matching "
                          <span className="font-semibold">{searchVal}</span>"
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider | */}
              <div className="hidden md:block h-6 w-px bg-gray-200 mx-1.5" />

              {/* Account profile */}
              <Link
                to="/account"
                className="p-2 hover:text-[#8CFF64] transition-colors text-black"
                aria-label="Account"
              >
                <User className="h-5 w-5 stroke-[1.8]" />
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 hover:text-[#8CFF64] transition-colors relative text-black"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 stroke-[1.8]" />
                {items && items.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#B5E12E] text-black text-[8px] font-bold flex items-center justify-center border border-white">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* Cart - Green Circle design like reference */}
              <button
                onClick={openCart}
                className="w-10 h-10 rounded-full bg-[#8CFF64] hover:bg-[#7be654] flex items-center justify-center relative transition-all duration-300 hover:scale-105"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[21px] w-[21px] text-black stroke-[1.8]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-[#8CFF64] text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to push content below fixed header */}
      <div className="h-[118px] lg:h-[140px]" />

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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-xs bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <img
                    src="/logo.png"
                    alt="Fuel & Nutrients Logo"
                    className="h-10 w-auto object-contain drop-shadow-sm"
                  />
                  <button onClick={() => setIsMenuOpen(false)} className="p-2">
                    <X className="h-6 w-6 text-black" />
                  </button>
                </div>

                <nav className="space-y-4">
                  <Link
                    to="/"
                    className="text-sm font-bold uppercase block py-2 text-black hover:text-[#8CFF64]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>

                  <div className="py-2">
                    <span className="text-sm font-bold uppercase block mb-3 text-black">
                      Shop Categories
                    </span>
                    <ul className="space-y-2 pl-3 border-l-2 border-[#8CFF64]">
                      {categoriesList.map((cat) => (
                        <li key={cat.name}>
                          <Link
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            className="text-xs uppercase font-semibold text-gray-500 hover:text-[#8CFF64] block py-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="py-2">
                    <span className="text-sm font-bold uppercase block mb-3 text-black">
                      Shop by Goal
                    </span>
                    <ul className="space-y-2 pl-3 border-l-2 border-[#8CFF64]">
                      {goalsList.map((goal) => (
                        <li key={goal.name}>
                          <Link
                            to={`/products?goal=${encodeURIComponent(goal.slug)}`}
                            className="text-xs uppercase font-semibold text-gray-500 hover:text-[#8CFF64] block py-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {goal.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/products"
                    className="text-sm font-bold uppercase block py-2 text-black hover:text-[#8CFF64]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop by Brand
                  </Link>
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                  {/* Dynamic Search for mobile */}
                  <div className="relative mt-2" ref={mobileSearchRef}>
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        placeholder="Search Supplements..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        onFocus={() => setIsMobileSearchFocused(true)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-xs font-semibold outline-none focus:border-[#8CFF64]"
                      />
                      <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <Search className="h-4 w-4 text-gray-400" />
                      </button>
                    </form>

                    {/* Mobile Live Results */}
                    {isMobileSearchFocused && searchVal.trim().length >= 2 && (
                      <div className="mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 max-h-[260px] overflow-y-auto">
                        {isSearchLoading ? (
                          <div className="p-3 text-center text-xs text-gray-400">
                            Searching...
                          </div>
                        ) : searchProducts.length > 0 ? (
                          <div className="space-y-1">
                            {searchProducts.map((product) => {
                              const img = processImageUrl(product.image);
                              return (
                                <Link
                                  key={product.id}
                                  to={`/product/${product.id}`}
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsMobileSearchFocused(false);
                                    setSearchVal("");
                                  }}
                                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                >
                                  <img
                                    src={img}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded-md border border-gray-100 shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-black truncate">
                                      {product.name}
                                    </p>
                                    <p className="text-[10px] font-semibold text-gray-500">
                                      ₹
                                      {Number(
                                        product.discountPrice || product.price,
                                      ).toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-3 text-center text-xs text-gray-500">
                            No products found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/account"
                    className="flex items-center gap-3 text-sm font-medium text-black pt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" /> Account Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 text-sm font-medium text-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5" /> My Wishlist
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
