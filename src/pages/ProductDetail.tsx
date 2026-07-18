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
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCreateReviewMutation } from "@/api/hooks/review.hooks";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = typeof id === "string" ? id : "";
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

  const mockProduct = products.find((p) => p.id === id);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const isLoggedIn = typeof window !== "undefined" && (!!localStorage.getItem("user_token") || !!localStorage.getItem("token"));
  
  // Extract logged-in user's full name
  const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const userFullName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    : "";

  const postReviewMutation = useCreateReviewMutation();

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    postReviewMutation.mutate({
      productId,
      rating: reviewRating,
      comment: reviewComment.trim()
    }, {
      onSuccess: () => {
        setReviewComment("");
        setReviewRating(5);
        alert("Thank you for your feedback! Review submitted successfully.");
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || err.message || "Failed to submit review. You might have already reviewed this product.");
      }
    });
  };

  const processImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
      : "http://192.168.1.2:4000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const product = dbProduct
    ? {
        id: dbProduct.id,
        name: dbProduct.name,
        price: Number(dbProduct.price),
        description: dbProduct.description || "",
        images: (Array.isArray(dbProduct.images) && dbProduct.images.length > 0
          ? dbProduct.images
          : dbProduct.image
            ? [dbProduct.image]
            : [
                "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800",
              ]
        ).map(processImageUrl),
        category: dbProduct.category?.name || "Uncategorized",
        subcategory: dbProduct.subCategory?.name || "",
        brand: dbProduct.brand || "P&N",
        rating: dbProduct.rating || 5,
        reviews: dbProduct.numReviews || 0,
        sizes: Array.isArray(dbProduct.sizes) ? dbProduct.sizes : [],
        colors: Array.isArray(dbProduct.colors) ? dbProduct.colors : [],
        tags: [],
        inStock: dbProduct.quantity > 0,
        netWeight: undefined,
      }
    : mockProduct;
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMainDetailOpen, setIsMainDetailOpen] = useState(true);
  const [zoomScale, setZoomScale] = useState(false);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="pt-32 pb-16 max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold mb-4 text-primary">
            Loading Product...
          </h1>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="pt-32 pb-16 max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold mb-4 text-[#8A1B28]">
            Product not found
          </h1>
          <Link
            to="/products"
            className="text-[#8A1B28] underline font-semibold"
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
          title: `Protein & Nutrients - ${product.name}`,
          text: product.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const whatsappMessage = `Hi P&N, I'm interested in purchasing ${product.name} (Net Wt. ${product.netWeight || ""}). Can you please share the details?`;
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
          }))
      : products.filter((p) => p.id !== id).slice(0, 4);

  return (
    <MainLayout>
      <div className="pt-24 lg:pt-32 pb-16 bg-[#FAF9F6] text-black">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="text-[10px] lg:text-xs uppercase tracking-widest text-[#888] mb-8 font-semibold">
            <Link to="/" className="hover:text-[#8A1B28] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-[#E5D5B5]">/</span>
            <Link
              to="/products"
              className="hover:text-[#8A1B28] transition-colors"
            >
              Products
            </Link>
            <span className="mx-2 text-[#E5D5B5]">/</span>
            <span className="text-[#2C2C2C]">{product.name}</span>
          </nav>

          {/* Product Gallery & Info Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery: Thumbnail Bar + Main Zoom Frame (Left columns) */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
              {/* Thumbnails list */}
              <div className="flex md:flex-col gap-3 order-2 md:order-1 flex-shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "w-16 h-16 md:w-20 md:h-20 rounded border-2 overflow-hidden transition-all bg-white shadow-sm flex-shrink-0",
                      selectedImage === idx
                        ? "border-[#8A1B28] ring-2 ring-[#8A1B28]/10"
                        : "border-[#E5D5B5]/60 hover:border-[#8A1B28]",
                    )}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image Frame */}
              <div className="flex-1 order-1 md:order-2 bg-card border border-border rounded-xl overflow-hidden relative aspect-square shadow-sm flex items-center justify-center p-3">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover rounded-lg",
                    zoomScale ? "scale-150 cursor-zoom-out" : "scale-100",
                  )}
                  onClick={() => setZoomScale(!zoomScale)}
                />

                {/* Main Zoom Frame Button overlay */}
                <button
                  onClick={() => setZoomScale(!zoomScale)}
                  className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-black/75 hover:bg-primary text-white text-[10px] uppercase font-bold tracking-wider rounded-full shadow z-10"
                >
                  <Maximize className="h-3 w-3 stroke-[2]" />
                  Zoom
                </button>
              </div>
            </div>

            {/* Info Block (Right columns) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Title & Icons line */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-black tracking-wide">
                    {product.name}
                  </h1>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mt-1">
                    {product.inStock ? "● In-Stock" : "● Out of Stock"}
                  </span>
                </div>

                {/* Quick actions buttons group */}
                <div className="flex items-center gap-2.5">
                  {/* WhatsApp query icon */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white border border-[#E5D5B5] hover:border-[#8A1B28] hover:text-[#8A1B28] text-[#555] rounded-full shadow-sm transition-colors"
                    title="Inquire on WhatsApp"
                  >
                    <MessageCircle className="h-4.5 w-4.5 stroke-[2] fill-current text-[#25D366]" />
                  </a>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="p-2 bg-white border border-[#E5D5B5] hover:border-[#8A1B28] hover:text-[#8A1B28] text-[#555] rounded-full shadow-sm transition-colors"
                    title="Share item"
                  >
                    <Share2 className="h-4.5 w-4.5 stroke-[2]" />
                  </button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() =>
                      toggleItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                      })
                    }
                    className="p-2 bg-white border border-[#E5D5B5] hover:border-[#8A1B28] hover:text-[#8A1B28] text-[#555] rounded-full shadow-sm transition-colors"
                    title="Add to wishlist"
                  >
                    <Heart
                      className={cn(
                        "h-4.5 w-4.5 stroke-[2]",
                        isInWishlist(product.id)
                          ? "fill-[#8A1B28] text-[#8A1B28]"
                          : "text-[#555]",
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Price Row */}
              <div className="border-y border-[#E5D5B5]/60 py-3 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#888] font-bold block mb-1">
                    Standard rate
                  </span>
                  <span className="text-xl lg:text-2xl font-extrabold text-[#8A1B28]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#555] font-semibold block uppercase tracking-wide">
                    Inclusive of all taxes
                  </span>
                  <span className="text-[9px] text-[#888] block">
                    * Making charges apply in store
                  </span>
                </div>
              </div>

              {/* Specifications list */}
              <div className="space-y-3.5 text-xs lg:text-sm text-black">
                {product.netWeight && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-semibold text-black">
                      Weight :
                    </span>
                    <span className="font-bold text-black">
                      {product.netWeight}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="font-semibold text-black">
                    Category :
                  </span>
                  <span className="font-bold text-black">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Quantity Selector and Add to Cart Section */}
              <div className="flex items-center gap-4 pt-4">
                {/* Quantity Box */}
                <div className="flex items-center border border-[#E5D5B5]/60 rounded bg-[#FAF9F6] h-12 px-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-black hover:text-[#8A1B28]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs lg:text-sm font-bold text-black">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-black hover:text-[#8A1B28]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    const firstSize = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : undefined;
                    const firstColor = Array.isArray(product.colors) && product.colors.length > 0 
                      ? (typeof product.colors[0] === "string" ? product.colors[0] : (product.colors[0] as any).name)
                      : undefined;
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0] ?? "",
                      size: firstSize,
                      color: firstColor,
                      quantity: quantity,
                    });
                  }}
                  className="flex-1 h-12 bg-black hover:bg-black/90 text-white text-xs lg:text-sm font-bold uppercase tracking-widest rounded shadow-sm"
                >
                  Add to Cart
                </button>

                {/* Wishlist Heart Button next to Add to Cart */}
                <button
                  onClick={() =>
                    toggleItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                    })
                  }
                  className="p-3 border border-[#E5D5B5]/60 hover:border-[#8A1B28] hover:text-[#8A1B28] text-black rounded bg-white shadow-sm h-12 flex items-center justify-center aspect-square"
                  title="Add to wishlist"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 stroke-[1.8]",
                      isInWishlist(product.id)
                        ? "fill-[#8A1B28] text-[#8A1B28]"
                        : "text-black",
                    )}
                  />
                </button>
              </div>


              {/* WhatsApp To Buy CTA Button */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-[#8A1B28] hover:bg-[#721620] text-white text-xs lg:text-sm font-bold uppercase tracking-widest py-3 px-6 rounded-full transition-colors shadow-md text-center"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  Whatsapp to Buy
                </a>
              </div>

              <div className="flex gap-2 p-3 bg-card rounded border border-border text-[10px] text-muted-foreground leading-relaxed">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span>
                  Our product availability and prices may vary. Tap the button
                  to verify final details with our live helpdesk.
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Product Details Accordion */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="border-b-2 border-[#8A1B28] pb-1.5 text-center mb-6">
              <span className="font-display text-base font-bold text-[#8A1B28] uppercase tracking-wider inline-block border-b-2 border-[#8A1B28] pb-1.5 -mb-[9.5px]">
                Product Detail
              </span>
            </div>

            {/* Accordion header */}
            <div className="border border-[#E5D5B5] rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setIsMainDetailOpen(!isMainDetailOpen)}
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-[#FAF9F6] text-xs lg:text-sm font-bold uppercase tracking-wider text-black"
              >
                <span>Main Detail</span>
                {isMainDetailOpen ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>

              {isMainDetailOpen && (
                <div
                  className="overflow-hidden bg-[#FAF9F6]/60"
                >
                  <div className="p-5 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs lg:text-sm text-black">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-semibold text-black">
                        Label/Tag Name
                      </span>
                      <span className="font-bold text-black uppercase">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-semibold text-black">
                        Brand
                      </span>
                      <span className="font-bold text-black">
                        {product.brand || "Protein & Nutrients"}
                      </span>
                    </div>
                    {product.subcategory && (
                      <div className="flex justify-between border-b border-border pb-2">
                        <span className="font-semibold text-black">
                          Subcategory
                        </span>
                        <span className="font-bold text-black">
                          {product.subcategory}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-semibold text-black">
                        Net Weight
                      </span>
                      <span className="font-bold text-black">
                        {product.netWeight || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2 md:col-span-2">
                      <span className="font-semibold text-black">
                        Category Name
                      </span>
                      <span className="font-bold text-black">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Reviews Section */}
          <div className="mt-16 max-w-4xl mx-auto border-t border-[#E5D5B5]/60 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-black tracking-wide">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-1.5 bg-[#8A1B28]/5 text-[#8A1B28] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Star className="h-4 w-4 fill-[#8A1B28] text-[#8A1B28]" />
                <span>{dbProduct?.rating || 0} ({dbProduct?.numReviews || 0} reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Reviews List */}
              <div className="md:col-span-2 space-y-6">
                {!dbProduct?.reviews || dbProduct.reviews.length === 0 ? (
                  <p className="text-black text-sm py-4">No reviews yet. Be the first to review this product!</p>
                ) : (
                  dbProduct.reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-border pb-6 last:border-b-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-black">
                          {rev.user ? (`${rev.user.firstName || ""} ${rev.user.lastName || ""}`.trim() || "Anonymous User") : "Anonymous User"}
                        </span>
                        <span className="text-[10px] text-black">
                          {new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "h-3.5 w-3.5",
                              s <= rev.rating ? "fill-[#8A1B28] text-[#8A1B28]" : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs lg:text-sm text-black leading-relaxed">
                        {rev.comment}
                      </p>
                      {rev.reply && (
                        <div className="ml-4 mt-3 bg-[#FAF9F6] border-l-2 border-[#8A1B28] p-3.5 rounded-r-lg space-y-1">
                          <p className="text-[10px] font-bold text-[#8A1B28] uppercase tracking-wider">
                            Reply from P&N
                          </p>
                          <p className="text-xs text-black leading-relaxed">
                            {rev.reply}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-card border border-[#E5D5B5] rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                  Write a Review
                </h3>
                {isLoggedIn ? (
                  <form onSubmit={handlePostReview} className="space-y-4">
                    <p className="text-[10px] text-gray-500 italic">
                      Posting as: <span className="font-bold text-[#8A1B28]">{userFullName || currentUser?.email || "Anonymous"}</span>
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-black uppercase tracking-wide block">
                        Your Rating
                      </label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={cn(
                                "h-6 w-6",
                                s <= reviewRating ? "fill-[#8A1B28] text-[#8A1B28]" : "text-gray-300 hover:text-[#8A1B28]/50"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="rev-comment" className="text-xs font-bold text-black uppercase tracking-wide block">
                        Comment
                      </label>
                      <textarea
                        id="rev-comment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={3}
                        className="w-full text-xs lg:text-sm bg-white border border-[#E5D5B5] focus:border-[#8A1B28] focus:ring-1 focus:ring-[#8A1B28]/20 rounded-lg p-2.5 outline-none resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={postReviewMutation.isPending}
                      className="w-full py-2.5 bg-[#8A1B28] hover:bg-[#721620] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm disabled:opacity-50"
                    >
                      {postReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <p className="text-xs text-black leading-normal">
                      You must be logged in to leave a review.
                    </p>
                    <Link
                      to="/login"
                      className="inline-block text-xs font-bold text-[#8A1B28] hover:underline"
                    >
                      Login Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products list */}
          {similarProducts.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-px bg-[#E5D5B5] w-12 lg:w-28 relative flex items-center justify-end">
                  <div className="w-2 h-2 bg-[#8A1B28] rounded-full border border-white absolute" />
                </div>
                <h2 className="font-display text-xl lg:text-2xl font-bold text-black text-center tracking-wide whitespace-nowrap">
                  Related Products
                </h2>
                <div className="h-px bg-[#E5D5B5] w-12 lg:w-28 relative flex items-center justify-start">
                  <div className="w-2 h-2 bg-[#8A1B28] rounded-full border border-white absolute" />
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                {similarProducts.map((p, idx) => (
                  <ProductCard key={p.id} product={p} index={idx} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
