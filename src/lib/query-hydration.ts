import { QueryClient } from "@tanstack/react-query";
import { categoryKeys } from "@/api/hooks/category.hooks";
import {
  fetchCategoriesServer,
} from "@/lib/server-api";

export function makeServerQueryClient() {
  return new QueryClient();
}

export async function prefetchChromeCategories(queryClient: QueryClient) {
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: categoryKeys.list({ limit: 1000 }),
      queryFn: async () => {
        const res = await fetchCategoriesServer({ limit: 1000 });
        if (!res) throw new Error("Failed to fetch header categories");
        return res;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKeys.list({ page: 1, limit: 10 }),
      queryFn: async () => {
        const res = await fetchCategoriesServer({ page: 1, limit: 10 });
        if (!res) throw new Error("Failed to fetch footer categories");
        return res;
      },
    }),
  ]);
}

