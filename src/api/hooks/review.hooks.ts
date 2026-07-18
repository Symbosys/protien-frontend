import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";
import { productKeys } from "./product.hooks";

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

export const reviewKeys = {
  all: ["reviews"] as const,
  list: (params?: Record<string, any>) => [...reviewKeys.all, "list", params] as const,
};

export interface ReviewItem {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  reply: string | null;
  status: string;
}

export interface FetchReviewsResponse {
  reviews: ReviewItem[];
  totalReviews: number;
  pagination: {
    totalPage: number;
    currentPage: number;
    count: number;
  };
}

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const response = await apiClient.post<{ success: boolean; data: any }>(
        "/review",
        payload,
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the detail query of the product to refresh reviews list
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
};

export const useReviewsQuery = (params?: { page?: number; limit?: number; rating?: number; search?: string }) => {
  return useQuery<FetchReviewsResponse>({
    queryKey: reviewKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: FetchReviewsResponse }>("/review/all", {
        params,
      });
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
