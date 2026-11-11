import type { MetadataRoute } from "next";
import { categories as mockCategories, products as mockProducts } from "@/data/products";
import { MOCK_BLOGS } from "@/lib/mock-blogs";
import { SITE_URL } from "@/lib/seo-config";
import {
  fetchBlogsServer,
  fetchCategoriesServer,
  fetchProductsServer,
} from "@/lib/server-api";

export const revalidate = 3600;

function safeIsoDate(input?: string | Date | null): Date {
  if (!input) return new Date();
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const pushEntry = (entry: MetadataRoute.Sitemap[number]) => {
    const cleanUrl = entry.url.replace(/&/g, "&amp;");
    if (seen.has(cleanUrl)) return;
    seen.add(cleanUrl);
    entries.push({ ...entry, url: cleanUrl });
  };

  // Core static public routes
  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/products", changeFrequency: "daily", priority: 0.9 },
    { path: "/categories", changeFrequency: "weekly", priority: 0.85 },
    { path: "/sale", changeFrequency: "daily", priority: 0.85 },
    { path: "/blog", changeFrequency: "daily", priority: 0.85 },
    { path: "/reviews", changeFrequency: "weekly", priority: 0.75 },
    { path: "/about", changeFrequency: "monthly", priority: 0.75 },
    { path: "/support", changeFrequency: "monthly", priority: 0.7 },
    { path: "/shipping-delivery", changeFrequency: "monthly", priority: 0.55 },
    { path: "/exchange-policy", changeFrequency: "monthly", priority: 0.55 },
    { path: "/return-refund", changeFrequency: "monthly", priority: 0.55 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.45 },
    { path: "/terms-conditions", changeFrequency: "monthly", priority: 0.45 },
  ];

  staticRoutes.forEach((route) => {
    pushEntry({
      url: route.path === "/" ? SITE_URL : `${SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  });

  // Fetch live data in parallel with generous timeout so sitemap always indexes live inventory
  const [productsRes, categoriesRes, blogsRes] = await Promise.all([
    fetchProductsServer({ limit: 500, sort: "newest" }, 15000),
    fetchCategoriesServer({ limit: 200 }, 15000),
    fetchBlogsServer({ isActive: true, limit: 200 }, 15000),
  ]);

  // Dynamic Category filter landing URLs
  const categories =
    categoriesRes?.categories && categoriesRes.categories.length > 0
      ? categoriesRes.categories.map((c) => ({
          name: c.name,
          updatedAt: c.updatedAt,
        }))
      : mockCategories.map((c) => ({
          name: c.name,
          updatedAt: now.toISOString(),
        }));

  categories.forEach((cat) => {
    if (!cat.name) return;
    pushEntry({
      url: `${SITE_URL}/products?category=${encodeURIComponent(cat.name)}`,
      lastModified: safeIsoDate(cat.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Dynamic Product detail URLs
  const products =
    productsRes?.products && productsRes.products.length > 0
      ? productsRes.products.map((p) => ({
          id: p.id,
          updatedAt: p.updatedAt || p.createdAt,
        }))
      : mockProducts.map((p) => ({
          id: p.id,
          updatedAt: now.toISOString(),
        }));

  products.forEach((p) => {
    if (!p.id) return;
    pushEntry({
      url: `${SITE_URL}/product/${encodeURIComponent(p.id)}`,
      lastModified: safeIsoDate(p.updatedAt),
      changeFrequency: "daily",
      priority: 0.9,
    });
  });

  // Dynamic Blog post URLs
  const blogs =
    blogsRes?.blogs && blogsRes.blogs.length > 0 ? blogsRes.blogs : MOCK_BLOGS;

  blogs.forEach((b) => {
    if (!b.slug) return;
    pushEntry({
      url: `${SITE_URL}/blog/${encodeURIComponent(b.slug)}`,
      lastModified: safeIsoDate(b.updatedAt || b.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  return entries;
}

