import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import { buildBreadcrumbSchema } from "@/lib/seo-schema";
import Privacy from "@/pages/Privacy";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy Policy for Fuel & Nutrients (M/S Protein and Nutrients). How we collect, safeguard, and handle customer data for sports supplement orders in India.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const queryClient = makeServerQueryClient();
  await prefetchChromeCategories(queryClient);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Privacy Policy — ${BRAND.name}`,
    url: `${SITE_URL}/privacy`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Privacy />
      </HydrationBoundary>
    </>
  );
}
