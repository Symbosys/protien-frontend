import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo-schema";
import ExchangePolicy from "@/pages/ExchangePolicy";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Exchange Policy — Damaged, Wrong or Expired Item Replacement",
  description:
    "Read the Fuel & Nutrients (M/S Protein and Nutrients) exchange policy. Report wrong, leaking, damaged, defective, or expired unopened supplements within 48 hours of delivery.",
  path: "/exchange-policy",
});

export default async function ExchangePolicyPage() {
  const queryClient = makeServerQueryClient();
  await prefetchChromeCategories(queryClient);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Exchange Policy — ${BRAND.name}`,
    url: `${SITE_URL}/exchange-policy`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Exchange Policy", path: "/exchange-policy" },
        ])}
      />
      <JsonLd
        data={buildFaqSchema([
          {
            question: "When is a supplement eligible for exchange on Fuel & Nutrients?",
            answer:
              "Unopened, unused supplements with original intact packaging and proof of purchase qualify for exchange if reported within 48 hours of delivery due to wrong item, transit damage, leakage, defect, or expiry.",
          },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExchangePolicy />
      </HydrationBoundary>
    </>
  );
}
