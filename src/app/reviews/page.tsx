import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import { buildBreadcrumbSchema } from "@/lib/seo-schema";
import Reviews from "@/pages/Reviews";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Customer Reviews & Testimonials (4.9/5 Rated)",
  description:
    "Read verified customer reviews of Fuel & Nutrients (M/S Protein and Nutrients). Rated 4.9/5 across India for authentic whey protein, pre-workout, amino acids, fast delivery & transparent pricing.",
  path: "/reviews",
  keywords: [
    "Fuel and Nutrients reviews",
    "Protein and Nutrients customer testimonials",
    "authentic whey protein reviews India",
  ],
});

export default async function ReviewsPage() {
  const queryClient = makeServerQueryClient();
  await prefetchChromeCategories(queryClient);

  const reviewPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Customer Reviews — ${BRAND.name}`,
    url: `${SITE_URL}/reviews`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "Store",
      "@id": `${SITE_URL}/#organization`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.9,
        reviewCount: 6,
        bestRating: 5,
        worstRating: 1,
      },
    },
  };

  return (
    <>
      <JsonLd data={reviewPageSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Customer Reviews", path: "/reviews" },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Reviews />
      </HydrationBoundary>
    </>
  );
}
