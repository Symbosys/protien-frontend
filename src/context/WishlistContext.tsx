import React, { createContext, useContext, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useWishlistQuery,
  useToggleWishlistMutation
} from '@/api/hooks/wishlist.hooks';

export interface WishlistItem {
  id: string; // Product ID
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  // Fetch wishlist from backend via TanStack Query
  const { data: dbWishlist, isLoading } = useWishlistQuery();
  const toggleMutation = useToggleWishlistMutation();
  const [localItems, setLocalItems] = React.useState<WishlistItem[]>([]);

  // Initialize local wishlist from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("local_wishlist");
    if (stored) {
      try {
        setLocalItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse local wishlist:", e);
      }
    }
  }, []);

  // Map backend items to WishlistItem (id = productId) and merge with local storage items
  const items: WishlistItem[] = useMemo(() => {
    const dbItemsMapped = dbWishlist ? dbWishlist.map((item) => ({
      id: item.productId,
      name: item.product?.name || "Unknown Product",
      price: item.product?.discountPrice 
        ? Number(item.product.discountPrice) 
        : Number(item.product?.price || 0),
      image: item.product?.image || "",
    })) : [];

    const merged = [...dbItemsMapped];
    localItems.forEach((localItem) => {
      if (!merged.some(item => item.id === localItem.id)) {
        merged.push(localItem);
      }
    });
    return merged;
  }, [dbWishlist, localItems]);

  // Check if a product ID is in the wishlist
  const isInWishlist = (id: string) => {
    return items.some(item => item.id === id);
  };

  // Toggle wishlist item
  const toggleItem = (item: WishlistItem) => {
    toggleMutation.mutate(item.id, {
      onSuccess: (res) => {
        if (res.added) {
          toast.success("Added to wishlist");
          // Remove from local storage if synced to backend successfully
          setLocalItems(prev => {
            const updated = prev.filter(i => i.id !== item.id);
            localStorage.setItem("local_wishlist", JSON.stringify(updated));
            return updated;
          });
        } else {
          toast.success("Removed from wishlist");
        }
      },
      onError: (err: any) => {
        console.warn("Backend wishlist sync failed, falling back to local storage:", err);
        setLocalItems(prev => {
          let updated;
          const exists = prev.some(i => i.id === item.id);
          if (exists) {
            updated = prev.filter(i => i.id !== item.id);
            toast.success("Removed from wishlist");
          } else {
            updated = [...prev, item];
            toast.success("Added to wishlist");
          }
          localStorage.setItem("local_wishlist", JSON.stringify(updated));
          return updated;
        });
      }
    });
  };

  // Add item (fallback to toggle if they explicitly call add)
  const addItem = (item: WishlistItem) => {
    if (!isInWishlist(item.id)) {
      toggleItem(item);
    }
  };

  // Remove item
  const removeItem = (id: string) => {
    if (isInWishlist(id)) {
      const match = items.find(i => i.id === id);
      if (match) {
        toggleItem(match);
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleItem, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
