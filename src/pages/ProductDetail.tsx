import {
  useProductDetailQuery,
  useProductsQuery,
} from "@/api/hooks/product.hooks";
import type { ProductCardItem } from "@/components/product/ProductCard";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Heart,
  Maximize,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  Star,
  Loader2,
  Truck,
  ShieldCheck,
  Award,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  RotateCcw,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useCreateReviewMutation } from "@/api/hooks/review.hooks";

function getPricing(
  rawPrice: string | number | null | undefined,
  rawDiscountPrice: string | number | null | undefined,
) {
  const p =
    rawPrice !== null && rawPrice !== undefined && rawPrice !== ""
      ? Number(rawPrice)
      : 0;
  const dp =
    rawDiscountPrice !== null &&
    rawDiscountPrice !== undefined &&
    rawDiscountPrice !== ""
      ? Number(rawDiscountPrice)
      : 0;

  if (p > 0 && dp > 0 && p !== dp) {
    return {
      sellingPrice: Math.min(p, dp),
      originalPrice: Math.max(p, dp),
    };
  } else if (p > 0) {
    return { sellingPrice: p, originalPrice: undefined };
  } else if (dp > 0) {
    return { sellingPrice: dp, originalPrice: undefined };
  }

  return { sellingPrice: 0, originalPrice: undefined };
}

export default function ProductDetail() {
  const params = useParams();
  const rawId = (params as any)?.id;
  const productId =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
        ? rawId[0]
        : "";

  const { data: dbProduct, isLoading } = useProductDetailQuery(
    productId,
    !!productId,
  );

  // Fetch related products from the same category (live)
  const { data: relatedData } = useProductsQuery(
    dbProduct?.categoryId
      ? { categoryId: dbProduct.categoryId, limit: 8 }
      : undefined,
    !!dbProduct?.categoryId,
  );

  const mockProduct = products.find((p) => p.id === productId);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  const isLoggedIn =
    typeof window !== "undefined" &&
    (!!localStorage.getItem("user_token") || !!localStorage.getItem("token"));

  // Extract logged-in user's full name
  const userStr =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const userFullName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    : "";

  const postReviewMutation = useCreateReviewMutation();

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    postReviewMutation.mutate(
      {
        productId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      },
      {
        onSuccess: () => {
          setReviewComment("");
          setReviewRating(5);
          alert("Thank you for your feedback! Review submitted successfully.");
        },
        onError: (err: any) => {
          alert(
            err.response?.data?.message ||
              err.message ||
              "Failed to submit review. You might have already reviewed this product.",
          );
        },
      },
    );
  };

  const processImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
      : "http://192.168.1.2:4000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomScale, setZoomScale] = useState(false);

  const thumbnailRef = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (thumbnailRef.current) {
      const selectedElem = thumbnailRef.current.children[selectedImage] as HTMLElement;
      if (selectedElem) {
        selectedElem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [selectedImage]);

  // Group all available attribute values by attribute name from all variants
  const attributesMap = useMemo(() => {
    const map: Record<
      string,
      { id: string; value: string; image: string | null }[]
    > = {};
    if (!dbProduct?.variants) return map;

    dbProduct.variants.forEach((v) => {
      v.attributeValues.forEach((av) => {
        const attrName = av.attribute.name;
        if (!map[attrName]) {
          map[attrName] = [];
        }
        // Avoid duplicate value names
        if (!map[attrName].some((item) => item.value === av.value)) {
          map[attrName].push({
            id: av.id,
            value: av.value,
            image: av.image || null,
          });
        }
      });
    });
    return map;
  }, [dbProduct]);

  // Initialize selectedAttributes state
  useEffect(() => {
    if (dbProduct?.variants && dbProduct.variants.length > 0) {
      const initial: Record<string, string> = {};
      Object.entries(attributesMap).forEach(([attrName, vals]) => {
        if (vals.length > 0) {
          initial[attrName] = vals[0].value;
        }
      });
      setSelectedAttributes(initial);
    }
  }, [attributesMap, dbProduct]);

  // Find the selected variant matching current selections, or fallback to first variant
  const selectedVariant = useMemo(() => {
    if (!dbProduct?.variants || dbProduct.variants.length === 0) return null;

    if (Object.keys(selectedAttributes).length > 0) {
      const match = dbProduct.variants.find((v) => {
        return Object.entries(selectedAttributes).every(
          ([attrName, selectedVal]) => {
            return v.attributeValues.some(
              (av) =>
                av.attribute.name === attrName && av.value === selectedVal,
            );
          },
        );
      });
      if (match) return match;
    }

    return dbProduct.variants[0] || null;
  }, [selectedAttributes, dbProduct]);

  // Reset selected state whenever the product changes to avoid carrying over stale state
  useEffect(() => {
    setSelectedAttributes({});
    setSelectedImage(0);
    setQuantity(1);
  }, [productId]);

  // Display ONLY the selected variant's images, or fallback to main product images
  const allProductImages = useMemo(() => {
    if (selectedVariant) {
      let variantImgs: string[] = [];
      if (Array.isArray(selectedVariant.images)) {
        variantImgs = selectedVariant.images;
      } else if (typeof selectedVariant.images === "string") {
        try {
          variantImgs = JSON.parse(selectedVariant.images);
        } catch (e) {
          variantImgs = [];
        }
      }
      if (variantImgs.length > 0) {
        return variantImgs.map(processImageUrl);
      }
      if (selectedVariant.image) {
        return [processImageUrl(selectedVariant.image)];
      }
    }

    const imgs: string[] = [];

    // Add main product image
    if (dbProduct?.image) {
      imgs.push(processImageUrl(dbProduct.image));
    }

    // Add product supplementary images
    if (Array.isArray(dbProduct?.images)) {
      dbProduct.images.forEach((img) => {
        const url = processImageUrl(img);
        if (url && !imgs.includes(url)) {
          imgs.push(url);
        }
      });
    }

    // Fallback if empty
    if (imgs.length === 0) {
      imgs.push(
        "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800",
      );
    }

    return imgs;
  }, [selectedVariant, dbProduct]);

  // Reset selected image index to 0 instantly when variant changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant?.id]);

  const hasVariants = Boolean(
    dbProduct?.variants && dbProduct.variants.length > 0,
  );
  const hasVariantStock =
    hasVariants &&
    Boolean(dbProduct?.variants?.some((v) => Number(v.quantity) > 0));
  const variantAvailable = hasVariants ? !!selectedVariant : true;
  const isStockAvailable = selectedVariant
    ? Number(selectedVariant.quantity) > 0
    : hasVariants
      ? hasVariantStock
      : dbProduct
        ? Number(dbProduct.quantity) > 0
        : true;

  const variantPricing = selectedVariant
    ? getPricing(selectedVariant.price, selectedVariant.discountPrice)
    : null;

  const mainPricing = dbProduct
    ? getPricing(dbProduct.price, dbProduct.discountPrice)
    : { sellingPrice: 0, originalPrice: undefined };

  const brandName = dbProduct
    ? typeof dbProduct.brand === "object" && dbProduct.brand !== null && "name" in dbProduct.brand
      ? (dbProduct.brand as any).name
      : typeof dbProduct.brand === "string" && dbProduct.brand.trim() !== ""
      ? dbProduct.brand
      : "Protein & Nutrients"
    : mockProduct?.brand || "Protein & Nutrients";

  const product = dbProduct
    ? {
        id: dbProduct.id,
        name: dbProduct.name,
        price: variantPricing
          ? variantPricing.sellingPrice
          : mainPricing.sellingPrice,
        originalPrice: variantPricing
          ? variantPricing.originalPrice
          : mainPricing.originalPrice,
        description: dbProduct.description || "",
        images: allProductImages,
        category: dbProduct.category?.name || "Uncategorized",
        subcategory: dbProduct.subCategory?.name || "",
        brand: brandName,
        rating: dbProduct.rating || 5,
        reviews: dbProduct.numReviews || 0,
        sizes: Array.isArray(dbProduct.sizes) ? dbProduct.sizes : [],
        colors: Array.isArray(dbProduct.colors) ? dbProduct.colors : [],
        tags: [],
        inStock: isStockAvailable,
        netWeight: undefined,
      }
    : mockProduct
      ? {
          id: mockProduct.id,
          name: mockProduct.name,
          price: mockProduct.price,
          originalPrice: mockProduct.originalPrice,
          description: mockProduct.description || "",
          images: mockProduct.images || [],
          category: mockProduct.category || "Uncategorized",
          subcategory: "",
          brand: mockProduct.brand || "Protein & Nutrients",
          rating: mockProduct.rating || 5,
          reviews: mockProduct.reviews || 0,
          sizes: mockProduct.sizes || [],
          colors: mockProduct.colors || [],
          tags: [],
          inStock: mockProduct.inStock ?? true,
          netWeight: mockProduct.netWeight,
        }
      : null;

  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24 pb-16 px-4">
          <Loader2 className="h-10 w-10 text-[#8A1B28] animate-spin mb-4" />
          <h2 className="font-display text-xl font-bold text-gray-800">Loading Product Details...</h2>
          <p className="text-xs text-gray-500 mt-1">Please wait a moment</p>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
          <div className="w-16 h-16 bg-red-50 text-[#8A1B28] rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-sm text-gray-600 mb-6 max-w-md">
            The product you are looking for might have been moved or is no longer available.
          </p>
          <Link
            to="/products"
            className="px-6 py-2.5 bg-[#8A1B28] hover:bg-[#721620] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            Back to Products
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Fuel & Nutrients - ${product.name}`,
          text: product.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const selectedAttrString = Object.entries(selectedAttributes)
    .filter(([_, val]) => !!val)
    .map(([key, val]) => `${key}: ${val}`)
    .join(", ");

  const whatsappMessage = `Hello Fuel & Nutrients! I am interested in purchasing "${product.name}"${
    selectedAttrString ? ` (${selectedAttrString})` : ""
  } - ₹${product.price.toLocaleString("en-IN")}. Could you please share ordering details?`;
  const whatsappUrl = `https://wa.me/916200065378?text=${encodeURIComponent(whatsappMessage)}`;

  const FALLBACK =
    "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800";
  function resolveImg(url: any) {
    const s = typeof url === "string" ? url : "";
    if (!s) return FALLBACK;
    if (s.startsWith("http") || s.startsWith("data:") || s.startsWith("blob:"))
      return s;
    const base = (
      process.env.NEXT_PUBLIC_API_URL ?? "http://192.168.1.2:4000"
    ).replace("/api", "");
    return `${base}${s.startsWith("/") ? "" : "/"}${s}`;
  }

  const similarProducts: ProductCardItem[] =
    relatedData?.products && relatedData.products.length > 0
      ? relatedData.products
          .filter((p) => p.id !== productId)
          .slice(0, 4)
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            originalPrice: p.discountPrice
              ? Number(p.discountPrice)
              : undefined,
            images: [
              resolveImg(p.image),
              ...(Array.isArray(p.images) ? p.images.map(resolveImg) : []),
            ],
            category: p.category?.name ?? "Uncategorized",
            rating: p.rating,
            inStock: p.quantity > 0,
            variants: p.variants,
          }))
      : [];

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <MainLayout>
      <div className="pt-4 sm:pt-6 lg:pt-8 pb-24 lg:pb-20 bg-[#FDFBF7] text-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs Header */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-medium overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
            <Link to="/" className="hover:text-[#8A1B28] transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <Link to="/products" className="hover:text-[#8A1B28] transition-colors">
              Products
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-gray-400 uppercase text-[10px] tracking-wider font-bold">{product.category}</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-semibold truncate max-w-[180px] sm:max-w-none">{product.name}</span>
          </nav>

          {/* Product Gallery & Info Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white p-4 sm:p-6 lg:p-8 rounded-3xl border border-amber-900/10 shadow-xl shadow-amber-950/5">
            
            {/* Left Column: Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col gap-4">
                
                {/* Main Large Display Frame */}
                <div className="w-full bg-gradient-to-b from-gray-50 to-amber-50/20 border border-gray-100 rounded-3xl overflow-hidden relative aspect-square shadow-inner flex items-center justify-center p-4 sm:p-6 group">
                  
                  {/* Top Badges overlay */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {discountPercentage && (
                      <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-lg">
                        {discountPercentage}% OFF
                      </span>
                    )}
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-gray-200 text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      Original Quality
                    </span>
                  </div>

                  {/* Main Product Image */}
                  <img
                    src={
                      product.images[selectedImage] ||
                      (selectedVariant && selectedVariant.image
                        ? processImageUrl(selectedVariant.image)
                        : product.images[0])
                    }
                    alt={product.name}
                    className={cn(
                      "w-full h-full object-contain drop-shadow-xl transition-transform duration-500 ease-out",
                      zoomScale ? "scale-150 cursor-zoom-out" : "scale-100 group-hover:scale-105 cursor-zoom-in",
                    )}
                    onClick={() => setZoomScale(!zoomScale)}
                  />

                  {/* Zoom Action Pill */}
                  <button
                    type="button"
                    onClick={() => setZoomScale(!zoomScale)}
                    className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900/80 hover:bg-black text-white text-[11px] font-bold tracking-wider rounded-full backdrop-blur-md shadow-lg transition-all"
                  >
                    <Maximize className="h-3.5 w-3.5" />
                    {zoomScale ? "Reset Zoom" : "Tap to Zoom"}
                  </button>
                </div>
                {/* Horizontal Thumbnails Row with Navigation Arrows */}
                {product.images && product.images.length > 0 && (
                  <div className="relative group/thumbs px-2">
                    {/* Left Scroll Arrow Button */}
                    {product.images.length > 3 && (
                      <button
                        type="button"
                        onClick={() => scrollThumbnails("left")}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:text-[#8A1B28] hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-90 hover:opacity-100"
                        title="Scroll left"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    )}

                    {/* Horizontal Scrollable Thumbnails Container */}
                    <div
                      ref={thumbnailRef}
                      className="flex flex-row gap-3 overflow-x-auto scroll-smooth py-2 px-1 max-w-full scrollbar-thin scrollbar-thumb-amber-800/30 scrollbar-track-transparent"
                    >
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(idx)}
                          className={cn(
                            "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden transition-all bg-gray-50 flex-shrink-0 relative p-1.5 focus:outline-none focus:ring-2 focus:ring-[#8A1B28]",
                            selectedImage === idx
                              ? "border-[#8A1B28] ring-4 ring-[#8A1B28]/10 shadow-md scale-105"
                              : "border-gray-200 hover:border-[#8A1B28]/50 opacity-80 hover:opacity-100",
                          )}
                        >
                          <img
                            src={img}
                            alt={`${product.name} thumbnail ${idx + 1}`}
                            className="w-full h-full object-contain rounded-xl"
                          />
                        </button>
                      ))}
                    </div>

                    {/* Right Scroll Arrow Button */}
                    {product.images.length > 3 && (
                      <button
                        type="button"
                        onClick={() => scrollThumbnails("right")}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:text-[#8A1B28] hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-90 hover:opacity-100"
                        title="Scroll right"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Info & Buy Options */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Brand & Stock Status Bar */}
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <span className="px-3 py-1 bg-[#8A1B28]/10 text-[#8A1B28] text-xs font-extrabold tracking-widest uppercase rounded-lg">
                  Brand: {product.brand}
                </span>

                <span
                  className={cn(
                    "text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5",
                    product.inStock
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200",
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      product.inStock ? "bg-emerald-500" : "bg-red-500",
                    )}
                  />
                  {product.inStock ? "In Stock (Ready to Ship)" : "Out of Stock"}
                </span>
              </div>

              {/* Title & Quick Actions */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    {product.name}
                  </h1>

                  {/* Action Icons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleShare}
                      className="p-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                      title="Share link"
                    >
                      <Share2 className="h-4.5 w-4.5 stroke-[2.2]" />
                    </button>

                    <button
                      onClick={() =>
                        toggleItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images[0],
                        })
                      }
                      className="p-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                      title="Add to Wishlist"
                    >
                      <Heart
                        className={cn(
                          "h-4.5 w-4.5 stroke-[2.2] transition-colors",
                          isInWishlist(product.id)
                            ? "fill-[#8A1B28] text-[#8A1B28] scale-110"
                            : "text-gray-700",
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Rating Badge Row */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/30 text-amber-900 px-3 py-1 rounded-xl text-xs font-bold shadow-2xs">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    ({product.reviews} customer reviews)
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified Authentic
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-transparent rounded-2xl border border-amber-900/10 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#8A1B28] tracking-tight">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base sm:text-lg line-through text-gray-400 font-medium">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  {discountPercentage && (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-extrabold rounded-lg shadow-sm">
                      Save ₹{(product.originalPrice! - product.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  Inclusive of all taxes • Free express home delivery
                </p>
              </div>

              {/* Variant Attribute Selectors */}
              {Object.keys(attributesMap).length > 0 && (
                <div className="space-y-4 pt-2">
                  {Object.entries(attributesMap).map(([attrName, vals]) => (
                    <div key={attrName} className="space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-700">
                        <span>Select {attrName}:</span>
                        <span className="text-[#8A1B28] font-bold bg-[#8A1B28]/10 px-2.5 py-0.5 rounded-md">
                          {selectedAttributes[attrName]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {vals.map((v) => {
                          const isSelected = selectedAttributes[attrName] === v.value;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() =>
                                setSelectedAttributes((prev) => ({
                                  ...prev,
                                  [attrName]: v.value,
                                }))
                              }
                              className={cn(
                                "px-4 py-2.5 text-xs font-bold rounded-2xl border transition-all flex items-center gap-2 min-h-[46px] shadow-sm hover:-translate-y-0.5 active:translate-y-0",
                                isSelected
                                  ? "bg-gradient-to-r from-gray-900 to-gray-800 border-gray-900 text-white shadow-md ring-2 ring-gray-900/30 scale-[1.02]"
                                  : "bg-white border-gray-200 text-gray-800 hover:border-gray-900 hover:bg-gray-50",
                              )}
                            >
                              {v.image && (
                                <img
                                  src={processImageUrl(v.image)}
                                  alt={v.value}
                                  className="w-5 h-5 rounded-full object-cover border border-white/40"
                                />
                              )}
                              <span>{v.value}</span>
                              {isSelected && <Check className="h-4 w-4 ml-0.5 text-amber-400 stroke-[3]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3 HealthXP Trust Badges Section */}
              <div className="py-4 my-2 border-y border-gray-100 bg-gray-50/60 rounded-2xl p-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  {/* 1. Authenticity Guaranteed */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E0F5F6] flex items-center justify-center flex-shrink-0 shadow-xs">
                      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 sm:w-9 sm:h-9">
                        <path
                          d="M24 5l2.6 3.6 4.3-1.2 1.2 4.3 4.3 1.2-1.2 4.3 3.6 2.6-2.6 3.6 2.6 3.6-4.3 1.2 1.2 4.3-4.3 1.2-1.2 4.3L24 43l-2.6 3.6-4.3-1.2-1.2-4.3-4.3-1.2 1.2-4.3-3.6-2.6 2.6-3.6-2.6-3.6 4.3-1.2-1.2-4.3 4.3-1.2L21.4 8.6 24 5z"
                          fill="#F5A623"
                          stroke="#D97706"
                          strokeWidth="1"
                        />
                        <circle cx="24" cy="23" r="12" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
                        <circle cx="24" cy="23" r="10" fill="#FFFBEB" stroke="#F5A623" strokeWidth="0.8" />
                        <text x="24" y="21" textAnchor="middle" fill="#92400E" fontSize="5.5" fontWeight="900" fontFamily="sans-serif">100%</text>
                        <text x="24" y="26.5" textAnchor="middle" fill="#92400E" fontSize="3.2" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.3">GUARANTEE</text>
                        <path d="M16 32l-3 5 4.5-1.5 3 2.5-1.5-6h-3z" fill="#D97706" />
                        <path d="M32 32l3 5-4.5-1.5-3 2.5 1.5-6h3z" fill="#D97706" />
                      </svg>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                      Authenticity<br />Guaranteed
                    </div>
                  </div>

                  {/* 2. Free Shipping */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E0F5F6] flex items-center justify-center flex-shrink-0 shadow-xs">
                      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 sm:w-9 sm:h-9">
                        <path d="M12 20l12-6 12 6v14l-12 6-12-6V20z" fill="#D97706" stroke="#78350F" strokeWidth="1" />
                        <path d="M12 20l12-6 12 6-12 6-12-6z" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                        <path d="M12 20l12 6v14l-12-6V20z" fill="#B45309" />
                        <path d="M21 15.5l6-3 6 3-6 3-6-3z" fill="#FEF08A" opacity="0.9" />
                        <path d="M24 18.5v14" stroke="#FEF08A" strokeWidth="2" opacity="0.9" />
                        <g transform="translate(23, 9)">
                          <rect x="0" y="0" width="16" height="11" rx="2" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
                          <path d="M-2 5.5l2-2v4l-2-2z" fill="#EF4444" />
                          <text x="8" y="8" textAnchor="middle" fill="#FFFFFF" fontSize="4.8" fontWeight="900" fontFamily="sans-serif">FREE</text>
                        </g>
                      </svg>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                      Free Shipping
                    </div>
                  </div>

                  {/* 3. Cash on Delivery */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E0F5F6] flex items-center justify-center flex-shrink-0 shadow-xs">
                      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 sm:w-9 sm:h-9">
                        <g transform="rotate(-10 20 20)">
                          <rect x="10" y="13" width="22" height="13" rx="1.5" fill="#34D399" stroke="#059669" strokeWidth="1" />
                          <circle cx="21" cy="19.5" r="3" fill="#059669" opacity="0.3" />
                          <text x="21" y="21.5" textAnchor="middle" fill="#047857" fontSize="5" fontWeight="900">₹</text>
                        </g>
                        <g transform="rotate(6 22 18)">
                          <rect x="13" y="11" width="22" height="13" rx="1.5" fill="#10B981" stroke="#047857" strokeWidth="1" />
                          <circle cx="24" cy="17.5" r="3" fill="#047857" opacity="0.3" />
                          <text x="24" y="19.5" textAnchor="middle" fill="#064E3B" fontSize="5" fontWeight="900">₹</text>
                        </g>
                        <path d="M10 36c1.5-4.5 4.5-7.5 9-8.25l4.5 1.5c1.5 0.75 3 0 3.75-1.5s0-3-1.5-3.75l-3-1.5c2.25-1.5 5.25-0.75 6.75 1.5l1.5 2.25c1.5 1.5 3.75 1.5 5.25 0l1.5-1.5" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M16 37.5c3-6 7.5-9 13.5-9 3 0 6 2.25 6 5.25 0 3.75-3 6.75-6 8.25L16 37.5z" fill="#FDBA74" stroke="#EA580C" strokeWidth="1" />
                      </svg>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                      Cash on Delivery
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Box & Primary Action CTAs */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-2xl bg-gray-50/80 p-1.5 shadow-inner h-14 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 text-gray-700 hover:text-[#8A1B28] hover:bg-white rounded-xl flex items-center justify-center transition-all shadow-2xs active:scale-95"
                    >
                      <Minus className="h-4 w-4 stroke-[2.5]" />
                    </button>
                    <span className="w-10 text-center text-base font-black text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 text-gray-700 hover:text-[#8A1B28] hover:bg-white rounded-xl flex items-center justify-center transition-all shadow-2xs active:scale-95"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    disabled={isAdding || !product.inStock}
                    onClick={async () => {
                      setIsAdding(true);
                      try {
                        const firstSize =
                          selectedAttributes["Size"] ||
                          selectedAttributes["size"] ||
                          selectedAttributes["Weight"] ||
                          selectedAttributes["weight"] ||
                          (Array.isArray(product.sizes) &&
                          product.sizes.length > 0
                            ? product.sizes[0]
                            : undefined);
                        const firstColor =
                          selectedAttributes["Flavour"] ||
                          selectedAttributes["flavour"] ||
                          selectedAttributes["Flavor"] ||
                          selectedAttributes["flavor"] ||
                          selectedAttributes["Color"] ||
                          selectedAttributes["color"] ||
                          (Array.isArray(product.colors) &&
                          product.colors.length > 0
                            ? typeof product.colors[0] === "string"
                              ? product.colors[0]
                              : (product.colors[0] as any).name
                            : undefined);
                        await addItem({
                          id: product.id,
                          variantId: selectedVariant?.id,
                          name: product.name,
                          price: product.price,
                          image: product.images[0] ?? "",
                          size: firstSize,
                          color: firstColor,
                          quantity: quantity,
                        });
                      } catch (err) {
                        // handled context
                      } finally {
                        setIsAdding(false);
                      }
                    }}
                    className={cn(
                      "flex-1 h-14 text-white text-xs sm:text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0",
                      product.inStock && !isAdding
                        ? "bg-gradient-to-r from-gray-900 via-black to-gray-900 hover:from-black hover:to-black shadow-gray-950/25 hover:shadow-2xl hover:shadow-gray-950/40 cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed",
                    )}
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding to Cart...
                      </>
                    ) : variantAvailable ? (
                      product.inStock ? (
                        <>
                          <ShoppingBag className="h-4.5 w-4.5 stroke-[2.2]" />
                          Add to Cart
                        </>
                      ) : (
                        "Out of Stock"
                      )
                    ) : (
                      "Variant Unavailable"
                    )}
                  </button>
                </div>

                {/* WhatsApp Order Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#25D366] via-[#22C55E] to-[#16A34A] hover:from-[#20BD5A] hover:to-[#15803D] text-white text-xs sm:text-sm font-black uppercase tracking-wider h-14 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  Order / Inquire via WhatsApp
                </a>
              </div>

              {/* Security info card */}
              <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-900/10 rounded-xl text-xs text-amber-900/80">
                <ShieldCheck className="h-5 w-5 text-[#8A1B28] flex-shrink-0" />
                <span>
                  100% Genuine product directly sourced from verified distributors. Guaranteed fresh stock.
                </span>
              </div>
            </div>
          </div>

          {/* Tabbed Product Details / Specifications / Reviews Section */}
          <div className="mt-12 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-lg shadow-amber-950/5">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 gap-6 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("desc")}
                className={cn(
                  "pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all relative whitespace-nowrap",
                  activeTab === "desc"
                    ? "text-[#8A1B28]"
                    : "text-gray-400 hover:text-gray-700",
                )}
              >
                Product Overview
                {activeTab === "desc" && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#8A1B28] rounded-t-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("specs")}
                className={cn(
                  "pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all relative whitespace-nowrap",
                  activeTab === "specs"
                    ? "text-[#8A1B28]"
                    : "text-gray-400 hover:text-gray-700",
                )}
              >
                Specifications & Details
                {activeTab === "specs" && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#8A1B28] rounded-t-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={cn(
                  "pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all relative whitespace-nowrap flex items-center gap-2",
                  activeTab === "reviews"
                    ? "text-[#8A1B28]"
                    : "text-gray-400 hover:text-gray-700",
                )}
              >
                Customer Reviews ({dbProduct?.numReviews || 0})
                {activeTab === "reviews" && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#8A1B28] rounded-t-full" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="pt-6">
              {/* Tab 1: Description */}
              {activeTab === "desc" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-gray-900">About {product.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description || "High-quality protein supplement formulated for optimal nutrition and strength development."}
                  </p>
                  
                  {/* Highlights Grid */}
                  <div className="grid sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Premium Quality</h4>
                        <p className="text-[11px] text-gray-500">Tested for purity</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Fast Shipping</h4>
                        <p className="text-[11px] text-gray-500">Dispatched in 24 hrs</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold">
                        <RotateCcw className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Easy Returns</h4>
                        <p className="text-[11px] text-gray-500">Hassle-free exchange</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Specifications */}
              {activeTab === "specs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm">
                    <span className="font-semibold text-gray-600">Brand Name:</span>
                    <span className="font-bold text-gray-900">{product.brand}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm">
                    <span className="font-semibold text-gray-600">Category:</span>
                    <span className="font-bold text-gray-900">{product.category}</span>
                  </div>
                  {product.subcategory && (
                    <div className="flex justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm">
                      <span className="font-semibold text-gray-600">Subcategory:</span>
                      <span className="font-bold text-gray-900">{product.subcategory}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm">
                    <span className="font-semibold text-gray-600">SKU Code:</span>
                    <span className="font-bold text-gray-900 font-mono">{selectedVariant?.sku || dbProduct?.sku || "N/A"}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm">
                    <span className="font-semibold text-gray-600">Stock Status:</span>
                    <span className={cn("font-bold", product.inStock ? "text-emerald-600" : "text-red-600")}>
                      {product.inStock ? "Available in Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 3: Reviews */}
              {activeTab === "reviews" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Reviews List */}
                  <div className="lg:col-span-2 space-y-4">
                    {!dbProduct?.reviews || dbProduct.reviews.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100">
                        <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">No reviews yet for this product.</p>
                        <p className="text-xs text-gray-400">Be the first customer to share your thoughts!</p>
                      </div>
                    ) : (
                      dbProduct.reviews.map((rev) => {
                        const revName = rev.user
                          ? `${rev.user.firstName || ""} ${rev.user.lastName || ""}`.trim() || "Verified Buyer"
                          : "Verified Buyer";
                        const initial = revName.charAt(0).toUpperCase();

                        return (
                          <div
                            key={rev.id}
                            className="p-4 sm:p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[#8A1B28] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                  {initial}
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm text-gray-900">{revName}</h4>
                                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                                    <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    s <= rev.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-200",
                                  )}
                                />
                              ))}
                            </div>

                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                              {rev.comment}
                            </p>

                            {rev.reply && (
                              <div className="ml-4 bg-white border-l-4 border-[#8A1B28] p-3 rounded-r-xl space-y-1 text-xs">
                                <p className="font-bold text-[#8A1B28]">Store Reply:</p>
                                <p className="text-gray-600">{rev.reply}</p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Review Form Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
                      Write a Product Review
                    </h3>

                    {isLoggedIn ? (
                      <form onSubmit={handlePostReview} className="space-y-4">
                        <p className="text-xs text-gray-500">
                          Posting as:{" "}
                          <span className="font-bold text-[#8A1B28]">
                            {userFullName || currentUser?.email || "User"}
                          </span>
                        </p>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                            Your Rating:
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setReviewRating(s)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  className={cn(
                                    "h-7 w-7",
                                    s <= reviewRating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300",
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="rev-comment"
                            className="text-xs font-bold text-gray-700 uppercase tracking-wide block"
                          >
                            Your Review:
                          </label>
                          <textarea
                            id="rev-comment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Tell others what you think about this product..."
                            rows={4}
                            className="w-full text-xs sm:text-sm bg-white border border-gray-200 focus:border-[#8A1B28] focus:ring-2 focus:ring-[#8A1B28]/10 rounded-xl p-3 outline-none resize-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={postReviewMutation.isPending}
                          className="w-full py-3 bg-[#8A1B28] hover:bg-[#721620] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-50"
                        >
                          {postReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    ) : (
                      <div className="text-center py-6 space-y-3">
                        <p className="text-xs text-gray-600">
                          Please log in to share your experience with this product.
                        </p>
                        <Link
                          to="/login"
                          className="inline-block px-5 py-2 bg-[#8A1B28] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#721620]"
                        >
                          Login to Review
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Carousel / Grid */}
          {similarProducts.length > 0 && (
            <section className="mt-16 sm:mt-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    Recommended for You
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Explore similar products from the same category</p>
                </div>
                <Link
                  to="/products"
                  className="text-xs font-bold text-[#8A1B28] hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {similarProducts.map((p, idx) => (
                  <ProductCard key={p.id} product={p} index={idx} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Mobile Bottom Floating Bar for Fast Checkout */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Price</span>
          <span className="text-lg font-extrabold text-[#8A1B28]">
            ₹{(product.price * quantity).toLocaleString("en-IN")}
          </span>
        </div>
        <button
          disabled={isAdding || !product.inStock}
          onClick={async () => {
            setIsAdding(true);
            try {
              const firstSize = selectedAttributes["Size"] || selectedAttributes["size"];
              const firstColor = selectedAttributes["Flavour"] || selectedAttributes["flavour"];
              await addItem({
                id: product.id,
                variantId: selectedVariant?.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? "",
                size: firstSize,
                color: firstColor,
                quantity: quantity,
              });
            } catch (err) {
              // handled context
            } finally {
              setIsAdding(false);
            }
          }}
          className={cn(
            "px-6 py-3.5 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center gap-2 active:scale-95",
            product.inStock && !isAdding
              ? "bg-gradient-to-r from-gray-900 via-black to-gray-900 hover:from-black hover:to-black shadow-gray-950/30 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          )}
        >
          <ShoppingBag className="h-4.5 w-4.5 stroke-[2.2]" />
          {isAdding ? "Adding..." : product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </MainLayout>
  );
}
