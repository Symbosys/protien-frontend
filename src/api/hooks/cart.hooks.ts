import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface BackendCartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  size: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    image: string;
    price: string | number; // Handles decimal or number
    discountPrice: string | number | null;
    quantity: number;
  };
  variant?: {
    id: string;
    sku: string | null;
    price: string | number;
    discountPrice: string | number | null;
    quantity: number;
    image: string | null;
  } | null;
}

export interface BackendCart {
  id: string;
  userId: string;
  items: BackendCartItem[];
  createdAt: string;
  updatedAt: string;
}

export const cartKeys = {
  all: ["cart"] as const,
};

// Hook to fetch the cart
export const useCartQuery = (enabled = true) => {
  return useQuery<BackendCart>({
    queryKey: cartKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: BackendCart }>("/cart");
      return response.data.data;
    },
    enabled,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook to add to cart
export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      productId: string;
      variantId?: string;
      quantity?: number;
      size?: string;
      color?: string;
    }) => {
      const response = await apiClient.post<{ success: boolean; data: BackendCartItem }>("/cart/add", params);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

// Hook to update cart item quantity
export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { itemId: string; quantity: number }) => {
      const response = await apiClient.put<{ success: boolean; data: BackendCartItem }>(
        `/cart/item/${params.itemId}`,
        { quantity: params.quantity }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

// Hook to remove cart item
export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiClient.delete<{ success: boolean }>(`/cart/item/${itemId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

// Hook to clear cart
export const useClearCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<{ success: boolean }>("/cart/clear");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};
