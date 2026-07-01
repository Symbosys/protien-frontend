import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface DBSubCategory {
  id: string;
  name: string;
  description: string;
  image: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBCategory {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  subCategories: DBSubCategory[];
}

export interface CategoriesResponse {
  categories: DBCategory[];
  pagination: {
    totalCategory: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export const categoryKeys = {
  all: ["categories"] as const,
  list: (params?: { page?: number; limit?: number }) => [...categoryKeys.all, "list", params] as const,
};

export const useCategoriesQuery = (params?: { page?: number; limit?: number }) => {
  return useQuery<CategoriesResponse>({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: CategoriesResponse }>("/catogary", {
        params,
      });
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
