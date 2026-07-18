import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useCategoriesQuery } from "@/api/hooks/category.hooks";
import { categories as mockCategories } from "@/data/products";
import { ChevronRight } from "lucide-react";

interface UnifiedCategory {
  id: string;
  name: string;
  image: string | null;
  subcategories: string[];
}

export default function CategoriesPage() {
  const { data, isLoading } = useCategoriesQuery({ limit: 100 });

  const categories: UnifiedCategory[] = useMemo(() => {
    if (data?.categories && data.categories.length > 0) {
      return data.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        image: cat.image,
        subcategories: (cat.subCategories || []).map((sub) => sub.name),
      }));
    }
    return mockCategories.map((cat, idx) => ({
      id: `mock-${idx}`,
      name: cat.name,
      image: cat.image,
      subcategories: cat.subcategories || [],
    }));
  }, [data]);

  const processImageUrl = (url: string | null) => {
    if (!url)
      return "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1200&auto=format&fit=crop";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:") ||
      url.startsWith("blob:")
    )
      return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
      : "http://192.168.1.2:4000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="pt-32 pb-20 bg-gray-50/30">
          <div className="container-luxe">
            {/* Breadcrumb skeleton */}
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-4" />
            
            {/* Header skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-3">
                <div className="h-12 w-80 bg-gray-200/80 animate-pulse rounded" />
                <div className="h-4 w-96 bg-gray-200/60 animate-pulse rounded" />
              </div>
              <div className="h-10 w-40 bg-gray-200/80 animate-pulse rounded-full" />
            </div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/5] bg-gray-100/70 animate-pulse rounded-2xl border border-gray-200/30 flex flex-col justify-end p-8 space-y-4"
                >
                  <div className="h-8 w-2/3 bg-gray-200 rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    <div className="h-6 w-12 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-32 pb-20 bg-gray-50/20">
        <div className="container-luxe">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <span className="text-black">Categories</span>
          </div>

          {/* Heading Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h1 className="heading-bold text-4xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tight">
                SHOP BY <span className="text-[#8CFF64]">CATEGORY</span>
              </h1>
              <p className="text-gray-500 font-medium text-sm md:text-base mt-2 max-w-xl">
                Fuel your ambition. Select a category below to explore premium protein powders, recovery aids, vitamins, and pre-workout formulas tailored for your goals.
              </p>
            </div>
            {/* Total categories badge */}
            <div className="flex-shrink-0">
              <span className="inline-flex items-center bg-[#8CFF64]/10 text-black border border-[#8CFF64]/40 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full">
                {categories.length} Total Categories
              </span>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => {
              const subcategories = category.subcategories;
              const imageUrl = processImageUrl(category.image);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <Link
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="group block relative aspect-[4/5] rounded-2xl overflow-hidden shadow-soft hover:shadow-medium border border-gray-100 hover:border-[#8CFF64]/30 bg-black transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Background Image */}
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/50 transition-all duration-300" />

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-[#8CFF64] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 z-10">
                      <div>
                        {/* Title */}
                        <h2 className="heading-bold text-2xl lg:text-3xl text-white group-hover:text-[#8CFF64] transition-colors mb-3">
                          {category.name}
                        </h2>

                        {/* Subcategories (Clickable pills) */}
                        {subcategories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {subcategories.slice(0, 3).map((sub) => (
                              <Link
                                key={sub}
                                to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                className="text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-white/10 hover:bg-[#8CFF64] hover:text-black border border-white/10 hover:border-transparent text-white rounded-full transition-all duration-300"
                              >
                                {sub}
                              </Link>
                            ))}
                            {subcategories.length > 3 && (
                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-black/40 border border-white/10 text-white/80 rounded-full">
                                +{subcategories.length - 3} MORE
                              </span>
                            )}
                          </div>
                        )}

                        {/* Call to Action */}
                        <div className="flex items-center gap-1.5 text-[#8CFF64] text-xs font-bold uppercase tracking-widest mt-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <span>Explore Category</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
