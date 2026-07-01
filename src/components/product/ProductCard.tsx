import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
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
}

interface ProductCardProps {
  product: ProductCardItem;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Resolve first size/color safely for both string[] and object[] shapes
    const firstSize = Array.isArray(product.sizes) && product.sizes.length > 0
      ? (typeof product.sizes[0] === "string" ? product.sizes[0] : undefined)
      : undefined;
    const firstColor = Array.isArray(product.colors) && product.colors.length > 0
      ? (typeof product.colors[0] === "string"
          ? product.colors[0]
          : (product.colors[0] as { name: string }).name)
      : undefined;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      size: firstSize,
      color: firstColor,
    });
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
      className="bg-white border border-[#E5D5B5]/60 hover:border-[#8A1B28]/40 hover:shadow-medium transition-all duration-300 rounded overflow-hidden"
    >
      <Link
        to={`/product/${product.id}`}
        className="group block"
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

          {/* Quick Add to Bag overlay on hover */}
          <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/95 backdrop-blur-sm border border-[#E5D5B5] text-[#2C2C2C] hover:bg-[#8A1B28] hover:text-white hover:border-[#8A1B28] text-[9px] font-bold uppercase tracking-widest rounded transition-colors shadow-sm"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Bag
            </button>
          </div>
        </div>

        {/* Product Info Block */}
        <div className="p-4 space-y-1">
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
    </motion.div>
  );
}
