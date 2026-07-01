import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useCategoriesQuery } from "@/api/hooks/category.hooks";
import { categories as mockCategories } from "@/data/products";

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="pt-32 pb-16">
          <div className="container-luxe">
            <div className="h-10 w-64 bg-secondary/50 animate-pulse rounded mb-4" />
            <div className="h-4 w-48 bg-secondary/50 animate-pulse rounded mb-12" />
            <div className="grid gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 lg:h-80 bg-secondary/30 animate-pulse rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-32 pb-16">
        <div className="container-luxe">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4">
            Shop by Category
          </h1>
          <p className="text-muted-foreground mb-12">
            Explore our complete collection
          </p>

          <div className="grid gap-8">
            {categories.map((category, index) => {
              const subcategories = category.subcategories;
              
              const processImageUrl = (url: string | null) => {
                if (!url) return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop";
                if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) return url;
                const baseUrl = process.env.NEXT_PUBLIC_API_URL
                  ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
                  : "http://localhost:4000";
                return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
              };

              const imageUrl = processImageUrl(category.image);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/products?category=${category.name}`}
                    className="group block relative h-64 lg:h-80 rounded-xl overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
                    <div className="absolute inset-0 flex items-center p-8 lg:p-12">
                      <div>
                        <h2 className="font-display text-3xl lg:text-5xl text-background mb-4">
                          {category.name}
                        </h2>
                        <div className="flex flex-wrap gap-3">
                          {subcategories.slice(0, 4).map((sub) => (
                            <Link
                              key={sub}
                              to={`/products?category=${category.name}&subcategory=${sub}`}
                              onClick={(e: React.MouseEvent) =>
                                e.stopPropagation()
                              }
                              className="px-3 py-1 bg-background/20 backdrop-blur-sm text-background text-sm rounded-full hover:bg-background/40 transition-colors"
                            >
                              {sub}
                            </Link>
                          ))}
                          {subcategories.length > 4 && (
                            <span className="px-3 py-1 bg-background/20 text-background text-sm rounded-full">
                              +{subcategories.length - 4} more
                            </span>
                          )}
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
