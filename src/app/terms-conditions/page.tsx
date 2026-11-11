import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import { buildBreadcrumbSchema } from "@/lib/seo-schema";
import TermsConditions from "@/pages/TermsConditions";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions — M/S Protein and Nutrients",
  description:
    "Terms and Conditions governing purchases, payments, shipping, and website use at Fuel & Nutrients (registered trade name M/S Protein and Nutrients).",
  path: "/terms-conditions",
});

export default async function TermsConditionsPage() {
  const queryClient = makeServerQueryClient();
  await prefetchChromeCategories(queryClient);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Terms & Conditions — ${BRAND.name} (${BRAND.legalName})`,
    url: `${SITE_URL}/terms-conditions`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms-conditions" },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TermsConditions />
      </HydrationBoundary>
    </>
  );
}
