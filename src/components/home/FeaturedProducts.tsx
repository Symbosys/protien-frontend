"use client";

import ProductCard, { ProductCardItem } from "@/components/product/ProductCard";
import { useProductsQuery } from "@/api/hooks/product.hooks";
import { products as mockProducts } from "@/data/products";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800";

function processImageUrl(url: any): string {
  if (!url) return FALLBACK_IMAGE;
  const str = typeof url === "string" ? url : "";
  if (!str) return FALLBACK_IMAGE;
  if (
    str.startsWith("http://") ||
    str.startsWith("https://") ||
    str.startsWith("data:") ||
    str.startsWith("blob:")
  )
    return str;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
    : "http://192.168.1.2:4000";
  return `${baseUrl}${str.startsWith("/") ? "" : "/"}${str}`;
}

export default function FeaturedProducts() {
  const { data: productsData, isLoading } = useProductsQuery({
    limit: 8,
    sort: "newest",
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Map backend products → ProductCardItem, fallback to mock data while loading or if empty
  const featured: ProductCardItem[] =
    productsData?.products && productsData.products.length > 0
      ? productsData.products.slice(0, 8).map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          originalPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
          images: [
            processImageUrl(p.image),
            ...(Array.isArray(p.images) ? p.images.map(processImageUrl) : []),
          ],
          category: p.category?.name ?? "Uncategorized",
          rating: p.rating,
          inStock: p.quantity > 0,
          sizes: Array.isArray(p.sizes) ? p.sizes : [],
          colors: Array.isArray(p.colors)
            ? (p.colors as any[]).map((c) =>
                typeof c === "string" ? { name: c } : c,
              )
            : [],
        }))
      : mockProducts.slice(0, 8);


  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="heading-bold text-3xl sm:text-4xl lg:text-5xl text-black">
              TOP PICKS <span className="text-[#8CFF64]">FOR</span>
            </h2>
            <h2 className="heading-bold text-3xl sm:text-4xl lg:text-5xl text-[#8CFF64]">
              YOU
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-black hover:text-[#5BBF3D] transition-colors group"
          >
            Shop All Products
            <span className="w-8 h-8 rounded-full border-2 border-black group-hover:border-[#8CFF64] flex items-center justify-center transition-colors">
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* Product Cards - Horizontal Scrollable */}
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="min-w-[260px] aspect-[3/4] bg-gray-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto hide-scrollbar pb-4"
          >
            {featured.map((product, index) => (
              <div
                key={product.id}
                className="min-w-[220px] sm:min-w-[260px] max-w-[280px] flex-shrink-0"
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
