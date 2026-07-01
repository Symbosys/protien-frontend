import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";
import { DBProduct } from "./product.hooks";

export interface DBWishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  product: DBProduct;
}

export const wishlistKeys = {
  all: ["wishlist"] as const,
};

// Hook to fetch the wishlist
export const useWishlistQuery = () => {
  return useQuery<DBWishlistItem[]>({
    queryKey: wishlistKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DBWishlistItem[] }>("/wishlist");
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook to toggle wishlist item (Add/Remove)
export const useToggleWishlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.post<{ success: boolean; data: { added: boolean } }>(
        "/wishlist/toggle",
        { productId }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};
