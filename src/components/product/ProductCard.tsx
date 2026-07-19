import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Plus, Minus, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Unified product shape accepted by ProductCard.
 * Supports both the static mock Product type and the mapped backend product.
 */
export interface ProductCardItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category?: string;
  rating?: number;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  netWeight?: string;
  sizes?: string[];
  colors?: { name: string; hex?: string }[] | string[];
  variants?: {
    id: string;
    productId: string;
    sku: string | null;
    price: string | number;
    discountPrice: string | number | null;
    quantity: number;
    image: string | null;
    attributeValues: {
      id: string;
      attributeId: string;
      value: string;
      attribute: {
        id: string;
        name: string;
      };
    }[];
  }[];
}

interface ProductCardProps {
  product: ProductCardItem;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  // Variant selector states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [modalQuantity, setModalQuantity] = useState(1);

  // Loading states
  const [isAddingLocal, setIsAddingLocal] = useState(false);
  const [isAddingModal, setIsAddingModal] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
      setModalQuantity(quantity);
      setIsModalOpen(true);
      return;
    }

    // Resolve first size/color safely for both string[] and object[] shapes
    const firstSize = Array.isArray(product.sizes) && product.sizes.length > 0
      ? (typeof product.sizes[0] === "string" ? product.sizes[0] : undefined)
      : undefined;
    const firstColor = Array.isArray(product.colors) && product.colors.length > 0
      ? (typeof product.colors[0] === "string"
          ? product.colors[0]
          : (product.colors[0] as { name: string }).name)
      : undefined;

    setIsAddingLocal(true);
    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
        size: firstSize,
        color: firstColor,
        quantity: quantity,
      });
    } catch (err) {
      // toast error handled inside CartContext
    } finally {
      setIsAddingLocal(false);
    }
  };

  const handleConfirmAdd = async () => {
    const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);
    if (!selectedVariant) return;

    let resolvedSize: string | undefined = undefined;
    let resolvedColor: string | undefined = undefined;

    selectedVariant.attributeValues.forEach(av => {
      const nameLower = av.attribute.name.toLowerCase();
      if (nameLower === "size") {
        resolvedSize = av.value;
      } else if (nameLower === "color" || nameLower === "flavour" || nameLower === "flavor") {
        resolvedColor = av.value;
      }
    });

    setIsAddingModal(true);
    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: Number(selectedVariant.price),
        image: selectedVariant.image || product.images[0] || "",
        size: resolvedSize,
        color: resolvedColor,
        variantId: selectedVariant.id,
        quantity: modalQuantity,
      });
      setIsModalOpen(false);
    } catch (err) {
      // toast error handled inside CartContext
    } finally {
      setIsAddingModal(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
    });
  };

  const discount =
    product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const isFavorited = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white border border-[#E5D5B5]/60 hover:border-[#8A1B28]/40 hover:shadow-medium transition-all duration-300 rounded overflow-hidden flex flex-col justify-between h-full"
    >
      <Link
        to={`/product/${product.id}`}
        className="group block flex-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Frame */}
        <div className="relative aspect-square bg-[#8A1B28]/5 overflow-hidden border-b border-[#E5D5B5]/30">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Second Image Hover Switch */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            />
          )}

          {/* Discount/New Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isNew && (
              <span className="px-2 py-0.5 bg-[#8A1B28] text-white text-[9px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
                New
              </span>
            )}
            {product.isSale && discount > 0 && (
              <span className="px-2 py-0.5 bg-[#D4AF37] text-white text-[9px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Product Info Block */}
        <div className="p-4 pb-2 space-y-1">
          {/* Row: Title & Wishlist Heart */}
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-display text-sm lg:text-base text-[#2C2C2C] font-semibold tracking-wide group-hover:text-[#8A1B28] transition-colors truncate">
              {product.name}
            </h3>

            <button
              onClick={handleWishlist}
              className="text-[#888] hover:text-[#8A1B28] transition-colors p-1"
              aria-label="Toggle Wishlist"
            >
              <Heart
                className={cn(
                  "h-4 w-4 stroke-[1.8]",
                  isFavorited ? "fill-[#8A1B28] text-[#8A1B28]" : "text-[#888]",
                )}
              />
            </button>
          </div>

          {/* Net Weight */}
          {product.netWeight && (
            <p className="text-[11px] text-[#555] font-medium">
              Net Wt. : <span className="text-[#2C2C2C] font-semibold">{product.netWeight}</span>
            </p>
          )}

          {/* Pricing Row */}
          <div className="flex items-center gap-2.5 pt-1">
            <span className="text-sm font-bold text-[#8A1B28]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#888] line-through font-light">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Block outside Link */}
      <div className="p-4 pt-0">
        <div className="flex gap-2 items-center pt-2 border-t border-gray-100">
          <div className="flex items-center border border-[#E5D5B5]/60 rounded bg-[#FAF9F6] h-8 px-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="p-0.5 text-[#555] hover:text-[#8A1B28] transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-[#2C2C2C]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
              className="p-0.5 text-[#555] hover:text-[#8A1B28] transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingLocal}
            className="flex-1 h-8 bg-black hover:bg-black/90 disabled:bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            {isAddingLocal ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Adding...
              </>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>

      {/* Variant Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Glassmorphic Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-[#E5D5B5] rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 overflow-hidden flex flex-col gap-4 text-black"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#8A1B28]">
                  Select Options
                </span>
                <h4 className="font-display text-base lg:text-lg font-bold text-black uppercase tracking-wide mt-1">
                  {product.name}
                </h4>
              </div>

              {/* Variant List */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                  Available Options:
                </p>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {product.variants?.map((v) => {
                    const displayName = v.attributeValues
                      .map((av) => `${av.attribute.name}: ${av.value}`)
                      .join(" | ");
                    const isSelected = selectedVariantId === v.id;
                    const vPrice = Number(v.price);
                    
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-4",
                          isSelected
                            ? "border-black bg-black/[0.02] ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-gray-50 border overflow-hidden flex-shrink-0">
                            <img
                              src={v.image || product.images[0] || ""}
                              alt={displayName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-black uppercase tracking-wider">
                              {displayName || "Default Variant"}
                            </p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase">
                              SKU: {v.sku || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-[#8A1B28]">
                            ₹{vPrice.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector & Confirm Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-2">
                <div className="flex items-center border border-gray-200 rounded h-10 px-3 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                    className="p-1 text-gray-500 hover:text-black transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-black">
                    {modalQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalQuantity(modalQuantity + 1)}
                    className="p-1 text-gray-500 hover:text-black transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleConfirmAdd}
                  disabled={isAddingModal}
                  className="flex-1 h-10 bg-black hover:bg-black/90 disabled:bg-black/60 text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {isAddingModal ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add to Bag"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
