import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo-schema";
import About from "@/pages/About";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "About Us — M/S Protein and Nutrients (Fuel & Nutrients)",
  description:
    "Learn about Fuel & Nutrients (registered trade name M/S Protein and Nutrients), Ranchi, India. Direct manufacturer sourcing, lab-tested whey protein, creatine & GMP-certified sports nutrition.",
  path: "/about",
  keywords: [
    "about Fuel and Nutrients",
    "M/S Protein and Nutrients Ranchi",
    "authentic supplement store India",
  ],
});

export default async function AboutPage() {
  const queryClient = makeServerQueryClient();
  await prefetchChromeCategories(queryClient);

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${BRAND.name} (${BRAND.legalName})`,
    url: `${SITE_URL}/about`,
    mainEntity: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <JsonLd data={aboutPageSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ])}
      />
      <JsonLd
        data={buildFaqSchema([
          {
            question: "Who operates Fuel & Nutrients (fuelandnutrients.com)?",
            answer:
              "Fuel & Nutrients (fuelandnutrients.com) is operated under the registered trade name M/S Protein and Nutrients (P&N), located at Ratu Road, Ranchi - 5, Jharkhand, India.",
          },
          {
            question: "Are supplements on Fuel & Nutrients lab-tested and genuine?",
            answer:
              "Yes. Every product is sourced directly from manufacturers and authorized partners, lab-tested for purity and potency, and backed by strict quality standards.",
          },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <About />
      </HydrationBoundary>
    </>
  );
}
