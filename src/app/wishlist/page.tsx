import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import Wishlist from "@/pages/Wishlist";

export const metadata: Metadata = buildPageMetadata({
  title: "Saved Wishlist",
  description: "View your saved supplements on Fuel & Nutrients.",
  path: "/wishlist",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <Wishlist />;
}
