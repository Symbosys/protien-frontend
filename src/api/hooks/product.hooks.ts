import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface DBAttributeValue {
  id: string;
  attributeId: string;
  value: string;
  attribute: {
    id: string;
    name: string;
  };
}

export interface DBProductVariant {
  id: string;
  productId: string;
  sku: string | null;
  price: string | number;
  discountPrice: string | number | null;
  quantity: number;
  image: string | null;
  attributeValues: DBAttributeValue[];
}

export interface DBProduct {
  id: string;
  name: string;
  description: string | null;
  image: string;
  images: string[]; // JSON string[]
  brand: string | null;
  price: string | number;
  discountPrice: string | number | null;
  quantity: number;
  sizes: string[]; // JSON string[]
  colors: { name: string; hex: string }[] | string[]; // JSON
  rating: number;
  numReviews: number;
  categoryId: string;
  subCategoryId: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  subCategory?: {
    id: string;
    name: string;
  } | null;
  variants?: DBProductVariant[];
}

export interface ProductsResponse {
  products: DBProduct[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

// Params accepted by GET /product
export interface GetProductsParams {
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  brand?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "name-asc" | "name-desc";
  // Dynamic attribute filters (e.g. { color: "Red,Blue", size: "M" })
  [key: string]: string | number | undefined;
}

// Payload for POST /product and PUT /product/:id
export interface ProductVariantInput {
  sku?: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image?: string; // base64 or URL
  attributeValues: string[]; // attribute value IDs
}

export interface CreateProductInput {
  name: string;
  description?: string;
  image: string; // base64 or URL
  images?: string[];
  brand?: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[] | string[];
  categoryId: string;
  subCategoryId?: string;
  variants?: ProductVariantInput[];
}

export type UpdateProductInput = Partial<CreateProductInput>;

// Payload for POST /product/add-to-bag
export interface AddToBagInput {
  productId: string;
  variantId?: string;
  quantity: number;
  size?: string;
  color?: string;
}

// Response shape for add-to-bag (mirrors BackendCartItem)
export interface AddToBagResponse {
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
    image: string;
    price: string | number;
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

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------

export const productKeys = {
  all: ["products"] as const,
  list: (params?: GetProductsParams) => [...productKeys.all, "list", params] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * GET /product
 * Fetch paginated, filtered, and sorted products.
 * Supports category, subcategory, brand, search, price range, sort, and
 * dynamic attribute/variant filters (e.g. { color: "Red", size: "M" }).
 */
export const useProductsQuery = (params?: GetProductsParams, enabled = true) => {
  return useQuery<ProductsResponse>({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: ProductsResponse }>(
        "/product",
        { params }
      );
      return response.data.data;
    },
    enabled,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * GET /product/:id
 * Fetch a single product by ID, including category, subCategory, and variants.
 */
export const useProductDetailQuery = (id: string, enabled = true) => {
  return useQuery<DBProduct>({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DBProduct }>(
        `/product/${id}`
      );
      return response.data.data;
    },
    enabled: enabled && !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * POST /product  (protected – admin)
 * Create a new product. Accepts base64 images; the backend uploads them to
 * Cloudinary automatically.
 */
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DBProduct, Error, CreateProductInput>({
    mutationFn: async (data) => {
      const response = await apiClient.post<{ success: boolean; data: DBProduct }>(
        "/product",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate all product lists so they refetch
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * PUT /product/:id  (protected – admin)
 * Update an existing product. Pass only the fields that need changing.
 * Supplying `variants` replaces all existing variants.
 */
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DBProduct, Error, { id: string; data: UpdateProductInput }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put<{ success: boolean; data: DBProduct }>(
        `/product/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_result, { id }) => {
      // Invalidate the specific product detail and all product lists
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * DELETE /product/:id  (protected – admin)
 * Permanently delete a product and its variants.
 */
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/product/${id}`);
    },
    onSuccess: (_result, id) => {
      // Remove the cached detail and refresh lists
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * POST /product/add-to-bag  (protected – customer)
 * Add a product (optionally a specific variant) to the authenticated user's
 * bag. If the same item already exists the backend merges quantities.
 * Invalidates the cart query so the bag count/display updates immediately.
 */
export const useAddToBagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AddToBagResponse, Error, AddToBagInput>({
    mutationFn: async (data) => {
      const response = await apiClient.post<{ success: boolean; data: AddToBagResponse }>(
        "/product/add-to-bag",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate the cart so the bag icon / cart page stays in sync
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
