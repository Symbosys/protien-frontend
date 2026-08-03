import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import { useCategoriesQuery } from "@/api/hooks/category.hooks";
import { useProductsQuery } from "@/api/hooks/product.hooks";
import { apiClient } from "@/api/apiclient/apiClient";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery =
    searchParams.get("q") || searchParams.get("search") || "";
  const [query, setQuery] = useState(initialQuery);

  const { data: categoriesData } = useCategoriesQuery({ limit: 50 });
  const { data: productsData, isLoading } = useProductsQuery(
    { search: query.trim(), limit: 50 },
    query.trim().length >= 2,
  );

  const processImageUrl = (url: any) => {
    if (!url) return "";
    const finalUrl = typeof url === "string" ? url : url.url || "";
    if (typeof finalUrl !== "string" || !finalUrl) return "";
    if (
      finalUrl.startsWith("http://") ||
      finalUrl.startsWith("https://") ||
      finalUrl.startsWith("data:") ||
      finalUrl.startsWith("blob:")
    )
      return finalUrl;
    const clientBaseUrl = apiClient.defaults.baseURL || "";
    const baseUrl =
      clientBaseUrl.replace("/api", "") || "http://localhost:4000";
    return `${baseUrl}${finalUrl.startsWith("/") ? "" : "/"}${finalUrl}`;
  };

  const rawProducts = productsData?.products || [];
  const searchResults = rawProducts.map((dbP: any) => {
    const p = Number(dbP.price) || 0;
    const dp = dbP.discountPrice ? Number(dbP.discountPrice) : 0;
    let sellingPrice = p;
    let originalPrice: number | undefined = undefined;

    if (p > 0 && dp > 0 && p !== dp) {
      sellingPrice = Math.min(p, dp);
      originalPrice = Math.max(p, dp);
    } else if (p > 0) {
      sellingPrice = p;
    } else if (dp > 0) {
      sellingPrice = dp;
    }

    return {
      id: dbP.id,
      name: dbP.name,
      price: sellingPrice,
      originalPrice: originalPrice,
      images: [
        processImageUrl(dbP.image),
        ...(Array.isArray(dbP.images) ? dbP.images.map(processImageUrl) : []),
      ].filter(Boolean),
      category: dbP.category?.name || "Uncategorized",
      brandId: dbP.brandId,
      inStock: Number(dbP.quantity) > 0,
      sizes: Array.isArray(dbP.sizes) ? dbP.sizes : [],
      colors: Array.isArray(dbP.colors) ? dbP.colors : [],
      variants: dbP.variants,
    };
  });

  const categories = categoriesData?.categories || [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <MainLayout>
      <div className="pt-32 pb-16">
        <div className="container-luxe">
          {/* Search Form Input */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <button
                type="submit"
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </button>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchParams(e.target.value ? { q: e.target.value } : {});
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    handleSearchSubmit(e);
                  }
                }}
                placeholder="Search for products, brands, or categories..."
                className="w-full bg-transparent border-b-2 border-border focus:border-foreground py-4 pl-10 pr-24 text-xl outline-none transition-colors"
                autoFocus
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSearchParams({});
                    }}
                    className="p-2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8CFF64] hover:bg-[#7be654] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Results or Suggestions */}
          {query.trim().length < 2 ? (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Whey Protein",
                    "Creatine",
                    "Isolate",
                    "Pre Workout",
                    "Mass Gainer",
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(term)}`);
                      }}
                      className="px-4 py-2 bg-secondary rounded-full text-sm hover:bg-muted transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Browse Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {isLoading
                    ? "Searching backend products..."
                    : `${searchResults.length} results for "${query}"`}
                </p>
                {searchResults.length > 0 && (
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="text-xs font-bold text-black hover:text-[#5BBF3D] flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                  >
                    View all on products page <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#8CFF64] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {searchResults.map((product: any, index: number) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-xl font-extrabold text-black uppercase mb-1 tracking-wide">
                    Product is not found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    No products found matching "<span className="font-semibold text-foreground">{query}</span>"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try checking the spelling or browse our popular categories.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
