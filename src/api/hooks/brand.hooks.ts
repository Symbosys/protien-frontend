import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface DBBrand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface BrandsResponse {
  brands: DBBrand[];
  pagination: {
    totalBrands: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export const brandKeys = {
  all: ["brands"] as const,
  list: (params?: { page?: number; limit?: number; search?: string; isActive?: boolean | string; sort?: string }) => [...brandKeys.all, "list", params] as const,
  detail: (idOrSlug: string) => [...brandKeys.all, "detail", idOrSlug] as const,
};

export const useBrandsQuery = (params?: { page?: number; limit?: number; search?: string; isActive?: boolean | string; sort?: string }) => {
  return useQuery<BrandsResponse>({
    queryKey: brandKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: BrandsResponse }>("/brand", {
        params,
      });
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useBrandDetailQuery = (idOrSlug: string) => {
  return useQuery<DBBrand>({
    queryKey: brandKeys.detail(idOrSlug),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DBBrand }>(`/brand/${idOrSlug}`);
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!idOrSlug,
  });
};
