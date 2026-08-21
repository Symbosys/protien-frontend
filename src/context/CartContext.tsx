import React, { createContext, useContext, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  useCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from '@/api/hooks/cart.hooks';
import { showLoginRequiredToast } from '@/lib/loginToast';

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
  const { isAuthenticated, checkAuth } = useAuth();

  // Fetch the cart using TanStack Query only when user is authenticated
  const { data: backendCart, isLoading, isFetching } = useCartQuery(isAuthenticated);

  // Mutations
  const addToCartMutation = useAddToCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const clearCartMutation = useClearCartMutation();

  const isCartLoading =
    (isAuthenticated && (isLoading || (isFetching && (!backendCart || backendCart.items?.length === 0)))) ||
    addToCartMutation.isPending;

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Map backend cart items to the frontend CartItem format
  const items: CartItem[] = useMemo(() => {
    if (!backendCart || !backendCart.items) return [];

    return backendCart.items.map((item) => ({
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
    }));
  }, [backendCart]);

  const addItem = async (
    item: Omit<CartItem, "quantity" | "productId"> & {
      id: string;
      quantity?: number;
      variantId?: string;
    },
  ) => {
    if (!checkAuth()) {
      showLoginRequiredToast();
      return;
    }

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
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add item to bag";
      toast.error(errorMessage);
    }
  };

  // Remove item
  const removeItem = async (id: string) => {
    try {
      await removeCartItemMutation.mutateAsync(id);
      toast.success("Removed from bag");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to remove item from bag";
      toast.error(errorMessage);
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(id);
    }

    try {
      await updateCartItemMutation.mutateAsync({ itemId: id, quantity });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update quantity";
      toast.error(errorMessage);
    }
  };

  // Clear cart
  const clearCart = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Bag cleared");
      },
      onError: (err: any) => {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to clear bag";
        toast.error(errorMessage);
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
        isLoading: isCartLoading,
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
