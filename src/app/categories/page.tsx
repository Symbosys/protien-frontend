import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { categories as mockCategories } from "@/data/products";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo-schema";
import { fetchCategoriesServer, resolveMediaUrl } from "@/lib/server-api";
import Categories from "@/pages/Categories";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "Supplement Categories — Whey Protein, Creatine, Pre-Workout & Vitamins",
  description:
    "Explore authentic supplement categories at Fuel & Nutrients (M/S Protein and Nutrients): Whey Protein, Isolate, Creatine, Pre-Workout, BCAA, EAA, Fish Oil, Multivitamins, Collagen, Glutathione, L-Carnitine & High Protein Snacks.",
  path: "/categories",
  keywords: [
    "sports supplement categories India",
    "whey protein and isolate",
    "creatine and pre workout",
    "multivitamins and fish oil India",
  ],
});

export default async function CategoriesPage() {
  const queryClient = makeServerQueryClient();
  const [categoriesRes] = await Promise.all([
    fetchCategoriesServer({ limit: 1000 }),
    prefetchChromeCategories(queryClient),
  ]);

  const categoriesList =
    categoriesRes?.categories && categoriesRes.categories.length > 0
      ? categoriesRes.categories.map((c) => ({
          name: c.name,
          url: `/products?category=${encodeURIComponent(c.name)}`,
          image: resolveMediaUrl(c.image),
        }))
      : mockCategories.map((c) => ({
          name: c.name,
          url: `/products?category=${encodeURIComponent(c.name)}`,
          image: c.image,
        }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Supplement Categories — ${BRAND.name}`,
    url: `${SITE_URL}/categories`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
        ])}
      />
      <JsonLd
        data={buildItemListSchema(
          "Supplement Categories",
          "/categories",
          categoriesList,
        )}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Categories />
      </HydrationBoundary>
    </>
  );
}
