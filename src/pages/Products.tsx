"use client";

import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Plus, Minus, X } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import {
  products as mockProducts,
  categories as mockCategories,
} from "@/data/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCategoriesQuery } from "@/api/hooks/category.hooks";
import { useProductsQuery } from "@/api/hooks/product.hooks";
import { useBrandsQuery } from "@/api/hooks/brand.hooks";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sort, setSort] = useState("newest");

  // Accordion state inside the filter drawer
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({
    sort: true,
    category: true,
    brand: true,
    karat: false,
    weight: false,
    price: false,
    stock: false,
  });

  const toggleSection = (section: string) => {
    setOpenSection((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const selectedCategory = searchParams.get("category");
  const selectedKarat = searchParams.get("karat");
  const selectedWeight = searchParams.get("weight");
  const selectedPriceRange = searchParams.get("priceRange");
  const selectedStock = searchParams.get("stock");
  const selectedBrandId = searchParams.get("brandId");

  // Fetch from backend
  const { data: categoriesData } = useCategoriesQuery({ limit: 100 });
  const { data: brandsData } = useBrandsQuery({ limit: 100 });
  const { data: productsData, isLoading } = useProductsQuery({
    limit: 100,
    brandId: selectedBrandId || undefined,
  });

  const processImageUrl = (url: any) => {
    if (!url)
      return "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800";
    const finalUrl = typeof url === "string" ? url : url.url || "";
    if (typeof finalUrl !== "string" || !finalUrl)
      return "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800";
    if (
      finalUrl.startsWith("http://") ||
      finalUrl.startsWith("https://") ||
      finalUrl.startsWith("data:") ||
      finalUrl.startsWith("blob:")
    )
      return finalUrl;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
      : "http://localhost:4000";
    return `${baseUrl}${finalUrl.startsWith("/") ? "" : "/"}${finalUrl}`;
  };

  // Map database categories, fallback to mock categories
  const categories = useMemo(() => {
    if (categoriesData?.categories && categoriesData.categories.length > 0) {
      return categoriesData.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        image: processImageUrl(cat.image),
      }));
    }
    return mockCategories;
  }, [categoriesData]);

  // Resolve active products list
  const displayProducts = useMemo(() => {
    let list: any[] = mockProducts;
    if (productsData?.products && productsData.products.length > 0) {
      list = productsData.products.map((dbP: any) => ({
        id: dbP.id,
        name: dbP.name,
        price: Number(dbP.price),
        originalPrice: dbP.discountPrice
          ? Number(dbP.discountPrice)
          : undefined,
        images: [
          processImageUrl(dbP.image),
          ...(Array.isArray(dbP.images) ? dbP.images.map(processImageUrl) : []),
        ],
        category: dbP.category?.name || "Uncategorized",
        brandId: dbP.brandId,
        rating: dbP.rating || 5,
        inStock: dbP.quantity > 0,
        netWeight: undefined,
        sizes: Array.isArray(dbP.sizes) ? dbP.sizes : [],
        colors: Array.isArray(dbP.colors)
          ? (dbP.colors as any[]).map((c: any) =>
              typeof c === "string" ? { name: c } : c,
            )
          : [],
      }));
    }

    // Apply front-end filters to display exactly what the user clicks
    if (selectedCategory) {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }
    if (selectedBrandId) {
      list = list.filter((p) => p.brandId === selectedBrandId);
    }
    if (selectedKarat) {
      list = list.filter((p) => p.karat?.includes(selectedKarat));
    }
    if (selectedWeight) {
      if (selectedWeight === "light") {
        list = list.filter((p) => {
          const w = parseFloat(p.netWeight || "0");
          return w <= 5;
        });
      } else if (selectedWeight === "medium") {
        list = list.filter((p) => {
          const w = parseFloat(p.netWeight || "0");
          return w > 5 && w <= 12;
        });
      } else if (selectedWeight === "heavy") {
        list = list.filter((p) => {
          const w = parseFloat(p.netWeight || "0");
          return w > 12;
        });
      }
    }
    if (selectedPriceRange) {
      if (selectedPriceRange === "under-50k") {
        list = list.filter((p) => p.price < 50000);
      } else if (selectedPriceRange === "50k-100k") {
        list = list.filter((p) => p.price >= 50000 && p.price <= 100000);
      } else if (selectedPriceRange === "over-100k") {
        list = list.filter((p) => p.price > 100000);
      }
    }
    if (selectedStock === "in") {
      list = list.filter((p) => p.inStock);
    }

    // Sort items
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [
    productsData,
    selectedCategory,
    selectedKarat,
    selectedWeight,
    selectedPriceRange,
    selectedStock,
    sort,
  ]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <MainLayout>
      <div className="py-12 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Categories Circle Slider on Top */}
          <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex justify-start md:justify-center items-center gap-6 md:gap-10 min-w-max px-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() =>
                    updateFilter(
                      "category",
                      selectedCategory === cat.name ? null : cat.name,
                    )
                  }
                  className="flex flex-col items-center group flex-shrink-0"
                >
                  <div
                    className={cn(
                      "w-16 h-16 md:w-20 md:h-20 rounded-full p-1 bg-white border transition-all duration-300 shadow-sm",
                      selectedCategory === cat.name
                        ? "border-[#8A1B28] ring-2 ring-[#8A1B28]/20"
                        : "border-[#E5D5B5] group-hover:border-[#8A1B28]",
                    )}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] md:text-xs font-bold uppercase tracking-wider mt-3 transition-colors",
                      selectedCategory === cat.name
                        ? "text-[#8A1B28]"
                        : "text-[#2C2C2C] group-hover:text-[#8A1B28]",
                    )}
                  >
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Toolbar */}
          <div className="flex items-center justify-between border-b border-border pb-5 mb-8">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground uppercase">
                {selectedCategory || "All Supplements"}
              </h1>
              <p className="text-xs text-muted-foreground tracking-wide mt-1">
                Showing {displayProducts.length} unique products
              </p>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 border border-border hover:border-primary hover:text-primary bg-background px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded transition-all shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4 stroke-[2]" />
              Filter
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {displayProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {displayProducts.length === 0 && (
            <div className="text-center py-20 bg-background border border-border rounded p-6">
              <h3 className="font-display text-lg font-bold text-primary mb-2 uppercase">
                No Products Found
              </h3>
              <p className="text-xs text-muted-foreground mb-6">
                Try resetting your active filters to explore more items.
              </p>
              <button
                onClick={clearFilters}
                className="bg-foreground hover:bg-primary text-background text-xs font-semibold uppercase tracking-widest py-3 px-6 rounded transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slide-In Left Filter Drawer Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-[#FAF9F6] border-r border-[#E5D5B5] z-50 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#E5D5B5] flex justify-between items-center bg-white shadow-sm">
                <span className="font-display text-base font-bold text-[#8A1B28] uppercase tracking-wider">
                  Filter & Sort
                </span>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 text-[#2C2C2C] hover:text-[#8A1B28]"
                  title="Close filter drawer"
                  aria-label="Close filter drawer"
                >
                  <X className="h-5 w-5 stroke-[2]" />
                </button>
              </div>

              {/* Collapsible Options Scroll Area */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#E5D5B5]/60 px-5">
                {/* 1. Sort By Accordion */}
                <div className="py-4">
                  <button
                    onClick={() => toggleSection("sort")}
                    className="w-full flex justify-between items-center text-xs uppercase font-bold tracking-wider text-[#2C2C2C]"
                  >
                    <span>Sort By</span>
                    {openSection.sort ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection.sort && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3 pl-2 space-y-2.5"
                      >
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSort(opt.value)}
                            className={cn(
                              "block text-xs text-left py-1 w-full font-medium transition-colors",
                              sort === opt.value
                                ? "text-[#8A1B28]"
                                : "text-[#555] hover:text-[#8A1B28]",
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Category Name Accordion */}
                <div className="py-4">
                  <button
                    onClick={() => toggleSection("category")}
                    className="w-full flex justify-between items-center text-xs uppercase font-bold tracking-wider text-[#2C2C2C]"
                  >
                    <span>Category Name</span>
                    {openSection.category ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection.category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3 pl-2 space-y-2.5"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat.name}
                            onClick={() =>
                              updateFilter(
                                "category",
                                selectedCategory === cat.name ? null : cat.name,
                              )
                            }
                            className={cn(
                              "block text-xs text-left py-1 w-full font-medium transition-colors",
                              selectedCategory === cat.name
                                ? "text-[#8A1B28] font-bold"
                                : "text-[#555] hover:text-[#8A1B28]",
                            )}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Brand Accordion */}
                <div className="py-4">
                  <button
                    onClick={() => toggleSection("brand")}
                    className="w-full flex justify-between items-center text-xs uppercase font-bold tracking-wider text-[#2C2C2C]"
                  >
                    <span>Brand</span>
                    {openSection.brand ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection.brand && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3 pl-2 space-y-2.5"
                      >
                        {brandsData?.brands?.map((brand) => (
                          <button
                            key={brand.id}
                            onClick={() =>
                              updateFilter(
                                "brandId",
                                selectedBrandId === brand.id ? null : brand.id,
                              )
                            }
                            className={cn(
                              "block text-xs text-left py-1 w-full font-medium transition-colors",
                              selectedBrandId === brand.id
                                ? "text-[#8A1B28] font-bold"
                                : "text-[#555] hover:text-[#8A1B28]",
                            )}
                          >
                            {brand.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Gold Karat Accordion */}
                <div className="py-4">
                  <button
                    onClick={() => toggleSection("karat")}
                    className="w-full flex justify-between items-center text-xs uppercase font-bold tracking-wider text-foreground"
                  >
                    <span>Options</span>
                    {openSection.karat ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection.karat && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3 pl-2 space-y-2.5"
                      >
                        {["Flavor 1", "Flavor 2"].map((kt) => (
                          <button
                            key={kt}
                            onClick={() =>
                              updateFilter(
                                "karat",
                                selectedKarat === kt ? null : kt,
                              )
                            }
                            className={cn(
                              "block text-xs text-left py-1 w-full font-medium transition-colors",
                              selectedKarat === kt
                                ? "text-primary font-bold"
                                : "text-muted-foreground hover:text-primary",
                            )}
                          >
                            {kt}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Gross Weight Accordion */}
                <div className="py-4">
                  <button
                    onClick={() => toggleSection("weight")}
                    className="w-full flex justify-between items-center text-xs uppercase font-bold tracking-wider text-[#2C2C2C]"
                  >
                    <span>Gross Weight</span>
                    {openSection.weight ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection.weight && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3 pl-2 space-y-2.5"
                      >
                        {[
                          { value: "light", label: "Under 5 grams" },
                          { value: "medium", label: "5 - 12 grams" },
                          { value: "heavy", label: "Over 12 grams" },
                        ].map((wt) => (
                          <button
                            key={wt.value}
                            onClick={() =>
                              updateFilter(
                                "weight",
                                selectedWeight === wt.value ? null : wt.value,
                              )
                            }
                            className={cn(
                              "block text-xs text-left py-1 w-full font-medium transition-colors",
                              selectedWeight === wt.value
                                ? "text-[#8A1B28] font-bold"
                                : "text-[#555] hover:text-[#8A1B28]",
                            )}
                          >
                            {wt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. Total Amount Range */}
                <div className="py-4">
                  <button
                    onClick={() => toggleSection("price")}
                    className="w-full flex justify-between items-center text-xs uppercase font-bold tracking-wider text-[#2C2C2C]"
                  >
                    <span>Total Amount</span>
                    {openSection.price ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection.price && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3 pl-2 space-y-2.5"
                      >
                        {[
                          { value: "under-50k", label: "Under ₹50,000" },
                          { value: "50k-100k", label: "₹50,000 - ₹1,00,000" },
                          { value: "over-100k", label: "Over ₹1,00,000" },
                        ].map((pr) => (
                          <button
                            key={pr.value}
                            onClick={() =>
                              updateFilter(
                                "priceRange",
                                selectedPriceRange === pr.value
                                  ? null
                                  : pr.value,
                              )
                            }
                            className={cn(
                              "block text-xs text-left py-1 w-full font-medium transition-colors",
                              selectedPriceRange === pr.value
                                ? "text-[#8A1B28] font-bold"
                                : "text-[#555] hover:text-[#8A1B28]",
                            )}
                          >
                            {pr.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 6. Availability */}
                <div className="py-4">
                  <button
                    onClick={() => toggleSection("stock")}
                    className="w-full flex justify-between items-center text-xs uppercase font-bold tracking-wider text-[#2C2C2C]"
                  >
                    <span>Availability</span>
                    {openSection.stock ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection.stock && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3 pl-2 space-y-2.5"
                      >
                        <button
                          onClick={() =>
                            updateFilter(
                              "stock",
                              selectedStock === "in" ? null : "in",
                            )
                          }
                          className={cn(
                            "block text-xs text-left py-1 w-full font-medium transition-colors",
                            selectedStock === "in"
                              ? "text-[#8A1B28] font-bold"
                              : "text-[#555] hover:text-[#8A1B28]",
                          )}
                        >
                          In Stock Only
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="p-5 border-t border-[#E5D5B5] bg-white flex gap-4">
                <button
                  onClick={() => {
                    clearFilters();
                    setIsFilterOpen(false);
                  }}
                  className="flex-1 border border-[#8A1B28] text-[#8A1B28] hover:bg-[#8A1B28]/5 text-xs font-bold uppercase tracking-widest py-3 rounded-full transition-colors"
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 bg-[#8A1B28] hover:bg-[#721620] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-full transition-colors"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
