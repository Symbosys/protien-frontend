import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import Checkout from "@/pages/Checkout";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout",
  description: "Complete your supplement order at Fuel & Nutrients.",
  path: "/checkout",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <Checkout />;
}
