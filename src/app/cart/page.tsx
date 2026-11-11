import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import Cart from "@/pages/Cart";

export const metadata: Metadata = buildPageMetadata({
  title: "Shopping Bag",
  description: "Review supplements in your shopping bag at Fuel & Nutrients.",
  path: "/cart",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <Cart />;
}
