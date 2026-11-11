import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import SavedItems from "@/pages/savedItem";

export const metadata: Metadata = buildPageMetadata({
  title: "Saved Items",
  description: "View your saved supplements on Fuel & Nutrients.",
  path: "/account/saved",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <SavedItems />;
}
