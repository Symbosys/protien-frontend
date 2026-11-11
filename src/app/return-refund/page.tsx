import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo-schema";
import ReturnAndRefund from "@/pages/returnAndRefund";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Return & Refund Policy",
  description:
    "Review the Fuel & Nutrients (M/S Protein and Nutrients) return and refund policy including eligibility requirements, return instructions, and refund timelines.",
  path: "/return-refund",
});

export default async function ReturnRefundPage() {
  const queryClient = makeServerQueryClient();
  await prefetchChromeCategories(queryClient);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Return & Refund Policy — ${BRAND.name}`,
    url: `${SITE_URL}/return-refund`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Return & Refund Policy", path: "/return-refund" },
        ])}
      />
      <JsonLd
        data={buildFaqSchema([
          {
            question: "How do I start a return on Fuel & Nutrients?",
            answer:
              "Ensure the item is unused in original packaging with proof of purchase, visit your Account Orders section or email support@protein-and-nutrients.com with your order number.",
          },
          {
            question: "When will I receive my refund?",
            answer:
              "Once a returned item is received and inspected, approved refunds are processed back to your original payment method within 5-7 business days.",
          },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReturnAndRefund />
      </HydrationBoundary>
    </>
  );
}
