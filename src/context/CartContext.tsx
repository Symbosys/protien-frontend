import React, { createContext, useContext, useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation
} from '@/api/hooks/cart.hooks';

export interface CartItem {
  id: string; // CartItem UUID from DB
  productId: string; // Product UUID
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  variant?: any;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity' | 'productId'> & { id: string; quantity?: number; variantId?: string }) => Promise<any>;
  removeItem: (id: string) => Promise<any>;
  updateQuantity: (id: string, quantity: number) => Promise<any>;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localItems, setLocalItems] = useState<CartItem[]>([]);

  // Initialize local cart from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("local_cart");
    if (stored) {
      try {
        setLocalItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse local cart:", e);
      }
    }
  }, []);

  // Fetch the cart using TanStack Query
  const { data: backendCart, isLoading } = useCartQuery();

  // Mutations
  const addToCartMutation = useAddToCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const clearCartMutation = useClearCartMutation();

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Map backend cart items to the frontend CartItem format and merge with local cart
  const items: CartItem[] = useMemo(() => {
    const dbItems: CartItem[] =
      backendCart && backendCart.items
        ? backendCart.items.map((item) => ({
            id: item.id, // Database CartItem ID
            productId: item.productId,
            name: item.product?.name || "Unknown Product",
            price: item.variant
              ? item.variant.discountPrice &&
                Number(item.variant.discountPrice) > 0 &&
                Number(item.variant.discountPrice) < Number(item.variant.price)
                ? Number(item.variant.discountPrice)
                : Number(item.variant.price)
              : item.product?.discountPrice &&
                  Number(item.product.discountPrice) > 0 &&
                  Number(item.product.discountPrice) < Number(item.product.price)
                ? Number(item.product.discountPrice)
                : Number(item.product?.price || 0),
            image: item.variant?.image || item.product?.image || "",
            quantity: item.quantity,
            size: item.size || undefined,
            color: item.color || undefined,
            variant: item.variant || undefined,
          }))
        : [];

    const merged = [...dbItems];
    localItems.forEach((localItem) => {
      if (!merged.some((i) => i.id === localItem.id)) {
        merged.push(localItem);
      }
    });
    return merged;
  }, [backendCart, localItems]);

  const saveLocalCart = (updated: CartItem[]) => {
    setLocalItems(updated);
    try {
      localStorage.setItem("local_cart", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save local cart to localStorage", e);
    }
  };

  const addItem = async (
    item: Omit<CartItem, "quantity" | "productId"> & {
      id: string;
      quantity?: number;
      variantId?: string;
    },
  ) => {
    const qtyToAdd = item.quantity ?? 1;
    try {
      await addToCartMutation.mutateAsync({
        productId: item.id,
        variantId: item.variantId,
        size: item.size,
        color: item.color,
        quantity: qtyToAdd,
      });
      toast.success("Added to bag");
      openCart();
    } catch (err: any) {
      // Fallback local cart storage if user is not logged in or request fails
      const existingIdx = localItems.findIndex(
        (i) =>
          i.productId === item.id &&
          i.size === item.size &&
          i.color === item.color,
      );
      let updated: CartItem[];
      if (existingIdx > -1) {
        updated = [...localItems];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qtyToAdd,
        };
      } else {
        const newItem: CartItem = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: qtyToAdd,
          size: item.size,
          color: item.color,
        };
        updated = [...localItems, newItem];
      }
      saveLocalCart(updated);
      toast.success("Added to bag");
      openCart();
    }
  };

  // Remove item
  const removeItem = async (id: string) => {
    if (id.startsWith("local-")) {
      const updated = localItems.filter((i) => i.id !== id);
      saveLocalCart(updated);
      toast.success("Removed from bag");
      return;
    }

    try {
      await removeCartItemMutation.mutateAsync(id);
      toast.success("Removed from bag");
    } catch (err: any) {
      const updated = localItems.filter((i) => i.id !== id);
      saveLocalCart(updated);
      toast.success("Removed from bag");
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(id);
    }

    if (id.startsWith("local-")) {
      const updated = localItems.map((i) =>
        i.id === id ? { ...i, quantity } : i,
      );
      saveLocalCart(updated);
      return;
    }

    try {
      await updateCartItemMutation.mutateAsync({ itemId: id, quantity });
    } catch (err: any) {
      const updated = localItems.map((i) =>
        i.id === id ? { ...i, quantity } : i,
      );
      saveLocalCart(updated);
    }
  };

  // Clear cart
  const clearCart = () => {
    saveLocalCart([]);
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Bag cleared");
      },
      onError: () => {
        toast.success("Bag cleared");
      },
    });
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
