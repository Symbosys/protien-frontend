import ProductCard, { ProductCardItem } from "@/components/product/ProductCard";
import { useProductsQuery } from "@/api/hooks/product.hooks";
import { products as mockProducts } from "@/data/products";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800";

function processImageUrl(url: any): string {
  if (!url) return FALLBACK_IMAGE;
  const str = typeof url === "string" ? url : "";
  if (!str) return FALLBACK_IMAGE;
  if (str.startsWith("http://") || str.startsWith("https://") || str.startsWith("data:") || str.startsWith("blob:")) return str;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
    : "http://localhost:4000";
  return `${baseUrl}${str.startsWith("/") ? "" : "/"}${str}`;
}

export default function FeaturedProducts() {
  const { data: productsData, isLoading } = useProductsQuery({ limit: 8, sort: "newest" });

  // Map backend products → ProductCardItem, fallback to mock data while loading or if empty
  const featured: ProductCardItem[] =
    productsData?.products && productsData.products.length > 0
      ? productsData.products.slice(0, 4).map((p) => ({
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
                typeof c === "string" ? { name: c } : c
              )
            : [],
        }))
      : mockProducts.slice(0, 4);

  return (
    <section className="section-padding bg-[#FAF9F6]">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#E5E5E5] pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] mb-2 font-light">
              Trending Now
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#2C2C2C] font-normal tracking-wide">
              Bestsellers
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#2C2C2C] hover:text-[#d4af37] transition-colors group pb-2"
          >
            View All
            <ArrowRight className="h-4 w-4 stroke-[1.5] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-[#E5D5B5]/30 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
