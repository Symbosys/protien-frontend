import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo-schema";
import ChatSupport from "@/pages/chatSupport";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Customer Support & Live Help",
  description:
    "Contact Fuel & Nutrients (M/S Protein and Nutrients) customer support for order assistance, supplement recommendations, delivery tracking & exchanges. Email support@protein-and-nutrients.com or call +91 7759957841.",
  path: "/support",
});

export default async function SupportPage() {
  const queryClient = makeServerQueryClient();
  await prefetchChromeCategories(queryClient);

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Customer Support — ${BRAND.name}`,
    url: `${SITE_URL}/support`,
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={contactPageSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Customer Support", path: "/support" },
        ])}
      />
      <JsonLd
        data={buildFaqSchema([
          {
            question: "How can I contact Fuel & Nutrients customer support?",
            answer:
              "You can reach Fuel & Nutrients support by emailing support@protein-and-nutrients.com, calling +91 7759957841, or chatting via WhatsApp (+91 6200065378 / +91 7759957841) or the on-site support chat.",
          },
          {
            question: "How can I track my supplement order?",
            answer:
              "Once dispatched, tracking details are sent via email, SMS, or WhatsApp, and you can also check status from your account orders or track-order page.",
          },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChatSupport />
      </HydrationBoundary>
    </>
  );
}
