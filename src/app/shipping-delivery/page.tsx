import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo-schema";
import ShippingDelivery from "@/pages/ShippingDelivery";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Shipping & Delivery Policy — Pan-India Supplement Delivery",
  description:
    "Shipping & delivery policy for Fuel & Nutrients (M/S Protein and Nutrients). Free delivery across India, 1-3 business days order processing, 5-7 business days delivery with real-time order tracking.",
  path: "/shipping-delivery",
});

export default async function ShippingDeliveryPage() {
  const queryClient = makeServerQueryClient();
  await prefetchChromeCategories(queryClient);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Shipping & Delivery Policy — ${BRAND.name}`,
    url: `${SITE_URL}/shipping-delivery`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Shipping & Delivery", path: "/shipping-delivery" },
        ])}
      />
      <JsonLd
        data={buildFaqSchema([
          {
            question: "How long does Fuel & Nutrients take to process and deliver orders in India?",
            answer:
              "Orders are typically processed within 1 to 3 business days and delivered across Metro Cities, Other Cities & Towns, and Remote Areas within India in an estimated 5 to 7 business days.",
          },
          {
            question: "Does Fuel & Nutrients offer free shipping across India?",
            answer:
              "Yes, Fuel & Nutrients offers free delivery all over India on eligible orders and promotions.",
          },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ShippingDelivery />
      </HydrationBoundary>
    </>
  );
}
