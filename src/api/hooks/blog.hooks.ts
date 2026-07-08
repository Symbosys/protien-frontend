import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface DBBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  author: string;
  tags: string[];
  isActive: boolean;
  viewsCount: number;
  readTime: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  blogs: DBBlog[];
  pagination: {
    totalBlogs: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export const blogKeys = {
  all: ["blogs"] as const,
  list: (params?: { page?: number; limit?: number; search?: string; isActive?: boolean | string; sort?: string; tag?: string }) => 
    [...blogKeys.all, "list", params] as const,
  detail: (slug: string) => [...blogKeys.all, "detail", slug] as const,
};

export const useBlogsQuery = (params?: { page?: number; limit?: number; search?: string; isActive?: boolean | string; sort?: string; tag?: string }) => {
  return useQuery<BlogsResponse>({
    queryKey: blogKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: BlogsResponse }>("/blog", {
        params,
      });
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useBlogDetailQuery = (slug: string) => {
  return useQuery<DBBlog>({
    queryKey: blogKeys.detail(slug),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DBBlog }>(`/blog/slug/${slug}`);
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!slug,
  });
};
