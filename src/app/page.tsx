import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { blogKeys } from "@/api/hooks/blog.hooks";
import { brandKeys } from "@/api/hooks/brand.hooks";
import { categoryKeys } from "@/api/hooks/category.hooks";
import { productKeys } from "@/api/hooks/product.hooks";
import { reviewKeys } from "@/api/hooks/review.hooks";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import {
  buildHomeFaqSchema,
  buildItemListSchema,
} from "@/lib/seo-schema";
import {
  computeProductPricing,
  fetchBlogsServer,
  fetchBrandsServer,
  fetchCategoriesServer,
  fetchProductsServer,
  fetchReviewsServer,
  getProductImages,
} from "@/lib/server-api";
import IndexPage from "@/pages/Index";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: BRAND.defaultTitle,
  absoluteTitle: true,
  description: BRAND.defaultDescription,
  path: "/",
});

export default async function HomePage() {
  const queryClient = makeServerQueryClient();

  const [
    homeCategoriesRes,
    featuredProductsRes,
  ] = await Promise.all([
    fetchCategoriesServer({ limit: 50 }),
    fetchProductsServer({ limit: 8, sort: "newest" }),
  ]);

  await Promise.allSettled([
    prefetchChromeCategories(queryClient),
    homeCategoriesRes
      ? Promise.resolve(
          queryClient.setQueryData(
            categoryKeys.list({ limit: 50 }),
            homeCategoriesRes,
          ),
        )
      : Promise.resolve(),
    featuredProductsRes
      ? Promise.resolve(
          queryClient.setQueryData(
            productKeys.list({ limit: 8, sort: "newest" }),
            featuredProductsRes,
          ),
        )
      : Promise.resolve(),
    queryClient.prefetchQuery({
      queryKey: brandKeys.list({ isActive: true, limit: 12 }),
      queryFn: async () => {
        const res = await fetchBrandsServer({ isActive: true, limit: 12 });
        if (!res) throw new Error("Failed to fetch brands");
        return res;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: reviewKeys.list({ limit: 10 }),
      queryFn: async () => {
        const res = await fetchReviewsServer({ limit: 10 });
        if (!res) throw new Error("Failed to fetch reviews");
        return res;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: blogKeys.list({ limit: 6, isActive: true }),
      queryFn: async () => {
        const res = await fetchBlogsServer({ limit: 6, isActive: true });
        if (!res) throw new Error("Failed to fetch blogs");
        return res;
      },
    }),
  ]);

  const featuredProducts = featuredProductsRes?.products || [];
  const featuredItemList =
    featuredProducts.length > 0
      ? buildItemListSchema(
          "Top Picks Sports Nutrition & Protein Supplements",
          "/",
          featuredProducts.slice(0, 8).map((p) => ({
            name: p.name,
            url: `/product/${encodeURIComponent(p.id)}`,
            image: getProductImages(p)[0],
            price: computeProductPricing(p.price, p.discountPrice).sellingPrice,
          })),
        )
      : null;

  const homeWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: BRAND.defaultTitle,
    description: BRAND.defaultDescription,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
  };

  return (
    <>
      <JsonLd data={homeWebPageSchema} />
      {featuredItemList && <JsonLd data={featuredItemList} />}
      <JsonLd data={buildHomeFaqSchema()} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <IndexPage />
      </HydrationBoundary>
    </>
  );
}
