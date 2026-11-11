import type { DBBlog, BlogsResponse } from "@/api/hooks/blog.hooks";
import type { BrandsResponse } from "@/api/hooks/brand.hooks";
import type { CategoriesResponse } from "@/api/hooks/category.hooks";
import type {
  DBProduct,
  GetProductsParams,
  ProductsResponse,
} from "@/api/hooks/product.hooks";
import type { FetchReviewsResponse } from "@/api/hooks/review.hooks";
import { products as mockProducts, type Product as MockProduct } from "@/data/products";
import { MOCK_BLOGS } from "@/lib/mock-blogs";
import { BACKEND_API_URL, BACKEND_ORIGIN, BRAND, SITE_URL } from "@/lib/seo-config";

const DEFAULT_FALLBACK_IMAGE: string = BRAND.ogImage;

export function resolveMediaUrl(
  url: unknown,
  fallback: string = DEFAULT_FALLBACK_IMAGE,
): string {
  if (!url) return fallback;
  const raw =
    typeof url === "string"
      ? url
      : typeof url === "object" && url !== null && "url" in url
        ? String((url as { url?: unknown }).url || "")
        : "";
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return fallback;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `${BACKEND_ORIGIN}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

export function stripHtmlAndMarkdown(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateText(text: string, maxLength = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength - 3);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced}...`;
}

export function computeProductPricing(
  rawPrice: string | number | null | undefined,
  rawDiscountPrice: string | number | null | undefined,
): { sellingPrice: number; originalPrice?: number } {
  const p =
    rawPrice !== null && rawPrice !== undefined && rawPrice !== ""
      ? Number(rawPrice) || 0
      : 0;
  const dp =
    rawDiscountPrice !== null &&
    rawDiscountPrice !== undefined &&
    rawDiscountPrice !== ""
      ? Number(rawDiscountPrice) || 0
      : 0;

  if (p > 0 && dp > 0 && p !== dp) {
    return {
      sellingPrice: Math.min(p, dp),
      originalPrice: Math.max(p, dp),
    };
  }
  if (p > 0) {
    return { sellingPrice: p };
  }
  if (dp > 0) {
    return { sellingPrice: dp };
  }
  return { sellingPrice: 0 };
}

export function extractBrandName(product: Partial<DBProduct> | null | undefined): string {
  if (!product) return BRAND.name;
  const b = product.brand;
  if (typeof b === "object" && b !== null && "name" in b && typeof b.name === "string" && b.name.trim()) {
    return b.name.trim();
  }
  if (typeof b === "string" && b.trim()) {
    return b.trim();
  }
  return BRAND.name;
}

export function isProductInStock(product: DBProduct): boolean {
  if (product.variants && product.variants.length > 0) {
    return (
      product.variants.some((v) => Number(v.quantity) > 0) ||
      Number(product.quantity) > 0
    );
  }
  return Number(product.quantity) > 0;
}

export function getProductImages(product: DBProduct): string[] {
  const urls: string[] = [];
  const pushUnique = (val: unknown) => {
    const resolved = resolveMediaUrl(val, "");
    if (resolved && !urls.includes(resolved)) {
      urls.push(resolved);
    }
  };

  pushUnique(product.image);
  if (Array.isArray(product.images)) {
    product.images.forEach(pushUnique);
  }
  if (Array.isArray(product.variants)) {
    product.variants.forEach((v) => {
      pushUnique(v.image);
      if (Array.isArray(v.images)) {
        v.images.forEach(pushUnique);
      }
    });
  }
  if (urls.length === 0) {
    urls.push(DEFAULT_FALLBACK_IMAGE);
  }
  return urls;
}

export function mockProductToDBProduct(p: MockProduct): DBProduct {
  const nowIso = "2026-06-01T00:00:00.000Z";
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    sku: `PN-${p.id}`,
    image: p.images[0] || DEFAULT_FALLBACK_IMAGE,
    images: p.images,
    brandId: null,
    brand: p.brand,
    price: p.originalPrice || p.price,
    discountPrice: p.originalPrice ? p.price : null,
    quantity: p.inStock ? 25 : 0,
    sizes: p.sizes,
    colors: p.colors,
    rating: p.rating,
    numReviews: p.reviews,
    categoryId: p.category.toLowerCase().replace(/\s+/g, "-"),
    subCategoryId: null,
    createdAt: nowIso,
    updatedAt: nowIso,
    category: {
      id: p.category.toLowerCase().replace(/\s+/g, "-"),
      name: p.category,
      slug: p.category.toLowerCase().replace(/\s+/g, "-"),
    },
    subCategory: p.subcategory
      ? {
          id: p.subcategory.toLowerCase().replace(/\s+/g, "-"),
          name: p.subcategory,
        }
      : null,
    variants: [],
  };
}

function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      sp.set(k, String(v));
    }
  });
  const str = sp.toString();
  return str ? `?${str}` : "";
}

async function fetchBackendJson<T>(
  pathWithQuery: string,
  revalidateSeconds = 300,
  timeoutMs = 8500,
  retries = 1,
): Promise<T | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${BACKEND_API_URL}${pathWithQuery}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          origin: SITE_URL,
        },
        next: { revalidate: revalidateSeconds },
        signal: controller.signal,
      });
      if (!res.ok) {
        if (res.status >= 500 && attempt < retries) {
          continue;
        }
        return null;
      }
      const json = (await res.json()) as { success?: boolean; data?: T };
      return json?.data ?? null;
    } catch {
      if (attempt === retries) return null;
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

export async function fetchCategoriesServer(
  params?: {
    page?: number;
    limit?: number;
  },
  timeoutMs = 8500,
): Promise<CategoriesResponse | null> {
  const qs = buildQueryString(params);
  return fetchBackendJson<CategoriesResponse>(`/catogary${qs}`, 300, timeoutMs);
}

export async function fetchBrandsServer(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean | string;
    sort?: string;
  },
  timeoutMs = 8500,
): Promise<BrandsResponse | null> {
  const qs = buildQueryString(params);
  return fetchBackendJson<BrandsResponse>(`/brand${qs}`, 300, timeoutMs);
}

export async function fetchProductsServer(
  params?: GetProductsParams,
  timeoutMs = 8500,
): Promise<ProductsResponse | null> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined>);
  return fetchBackendJson<ProductsResponse>(`/product${qs}`, 300, timeoutMs);
}

export async function fetchProductDetailServer(
  id: string,
  allowMockFallback = true,
  timeoutMs = 8500,
): Promise<{ product: DBProduct | null; isMockFallback: boolean }> {
  if (!id) return { product: null, isMockFallback: false };
  const live = await fetchBackendJson<DBProduct>(
    `/product/${encodeURIComponent(id)}`,
    300,
    timeoutMs,
  );
  if (live && live.id) {
    return { product: live, isMockFallback: false };
  }
  if (allowMockFallback) {
    const mock = mockProducts.find((p) => p.id === id);
    if (mock) {
      return { product: mockProductToDBProduct(mock), isMockFallback: true };
    }
  }
  return { product: null, isMockFallback: false };
}

export async function fetchBlogsServer(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean | string;
    sort?: string;
    tag?: string;
  },
  timeoutMs = 8500,
): Promise<BlogsResponse | null> {
  const qs = buildQueryString(params);
  return fetchBackendJson<BlogsResponse>(`/blog${qs}`, 300, timeoutMs);
}

export async function fetchBlogDetailServer(
  slug: string,
  allowMockFallback = true,
  timeoutMs = 8500,
): Promise<{ blog: DBBlog | null; isMockFallback: boolean }> {
  if (!slug) return { blog: null, isMockFallback: false };
  const live = await fetchBackendJson<DBBlog>(
    `/blog/slug/${encodeURIComponent(slug)}`,
    300,
    timeoutMs,
  );
  if (live && live.slug) {
    return { blog: live, isMockFallback: false };
  }
  if (allowMockFallback) {
    const mock = MOCK_BLOGS.find((b) => b.slug === slug);
    if (mock) {
      return { blog: mock, isMockFallback: true };
    }
  }
  return { blog: null, isMockFallback: false };
}

export async function fetchReviewsServer(
  params?: {
    page?: number;
    limit?: number;
    rating?: number;
    search?: string;
  },
  timeoutMs = 8500,
): Promise<FetchReviewsResponse | null> {
  const qs = buildQueryString(params);
  return fetchBackendJson<FetchReviewsResponse>(`/review/all${qs}`, 300, timeoutMs);
}
