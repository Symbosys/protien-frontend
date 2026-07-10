import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";
import { productKeys } from "./product.hooks";

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const response = await apiClient.post<{ success: boolean; data: any }>(
        "/review",
        payload
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the detail query of the product to refresh reviews list
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
    },
  });
};
