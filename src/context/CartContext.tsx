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

  // Fetch the cart using TanStack Query
  const { data: backendCart, isLoading } = useCartQuery();

  // Mutations
  const addToCartMutation = useAddToCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const clearCartMutation = useClearCartMutation();

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Map backend cart items to the frontend CartItem format
  const items: CartItem[] = useMemo(() => {
    if (!backendCart || !backendCart.items) return [];
    return backendCart.items.map((item) => ({
      id: item.id, // Database CartItem ID (used for updates and removal)
      productId: item.productId, // Original Product ID
      name: item.product?.name || "Unknown Product",
      price: item.variant 
        ? Number(item.variant.price) 
        : Number(item.product?.price || 0),
      image: item.variant?.image || item.product?.image || "",
      quantity: item.quantity,
      size: item.size || undefined,
      color: item.color || undefined,
      variant: item.variant || undefined,
    }));
  }, [backendCart]);

  const addItem = async (item: Omit<CartItem, 'quantity' | 'productId'> & { id: string; quantity?: number; variantId?: string }) => {
    // When adding from ProductCard/ProductDetail, item.id is product.id.
    return addToCartMutation.mutateAsync(
      {
        productId: item.id, // item.id is the product ID
        variantId: item.variantId,
        size: item.size,
        color: item.color,
        quantity: item.quantity ?? 1,
      },
      {
        onSuccess: () => {
          toast.success("Added to bag");
          openCart();
        },
        onError: (err: any) => {
          const status = err.response?.status;
          if (status === 401) {
            toast.error("Please log in to add items to your bag");
          } else {
            toast.error(err.response?.data?.message || "Failed to add item to bag");
          }
        },
      }
    );
  };

  // Remove item
  const removeItem = async (id: string) => {
    return removeCartItemMutation.mutateAsync(id, {
      onSuccess: () => {
        toast.success("Removed from bag");
      },
      onError: (err: any) => {
        toast.error("Failed to remove item");
      },
    });
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(id);
    }

    return updateCartItemMutation.mutateAsync(
      { itemId: id, quantity },
      {
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to update quantity");
        },
      }
    );
  };

  // Clear cart
  const clearCart = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Bag cleared");
      },
      onError: (err: any) => {
        toast.error("Failed to clear bag");
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
