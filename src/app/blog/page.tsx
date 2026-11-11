import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { blogKeys } from "@/api/hooks/blog.hooks";
import JsonLd from "@/components/seo/JsonLd";
import { MOCK_BLOGS } from "@/lib/mock-blogs";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo-schema";
import { fetchBlogsServer, resolveMediaUrl } from "@/lib/server-api";
import BlogPage from "@/pages/BlogListPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Fitness, Nutrition & Supplement Guides Blog",
  description:
    "Read expert articles on whey protein, creatine dosage & safety, weight loss tips, muscle recovery, nutrition & high-protein meal ideas from Fuel & Nutrients (M/S Protein and Nutrients).",
  path: "/blog",
  keywords: [
    "sports nutrition blog India",
    "creatine guide athletes",
    "whey protein benefits and dosage",
    "high protein breakfast ideas",
    "fitness supplement guides",
  ],
});

export default async function BlogListRoutePage() {
  const queryClient = makeServerQueryClient();

  const [blogsRes] = await Promise.all([
    fetchBlogsServer({ isActive: true, sort: "newest" }),
    prefetchChromeCategories(queryClient),
  ]);

  const fallbackBlogsRes = {
    blogs: MOCK_BLOGS,
    pagination: {
      totalBlogs: MOCK_BLOGS.length,
      totalPages: 1,
      page: 1,
      limit: MOCK_BLOGS.length,
    },
  };

  queryClient.setQueryData(
    blogKeys.list({ search: undefined, isActive: true, sort: "newest" }),
    blogsRes && blogsRes.blogs.length > 0 ? blogsRes : fallbackBlogsRes,
  );

  const posts =
    blogsRes?.blogs && blogsRes.blogs.length > 0 ? blogsRes.blogs : MOCK_BLOGS;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${BRAND.name} Nutrition & Fitness Blog`,
    description:
      "Evidence-based nutrition, sports supplementation, creatine dosing, protein intake, and healthy lifestyle articles.",
    url: `${SITE_URL}/blog`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <JsonLd
        data={buildItemListSchema(
          "Nutrition & Supplement Guides",
          "/blog",
          posts.slice(0, 20).map((b) => ({
            name: b.title,
            url: `/blog/${encodeURIComponent(b.slug)}`,
            image: resolveMediaUrl(b.image),
          })),
        )}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogPage />
      </HydrationBoundary>
    </>
  );
}
