import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import Search from "@/pages/Search";

export const metadata: Metadata = buildPageMetadata({
  title: "Search Supplements",
  description:
    "Search authentic whey protein, creatine, pre-workout, amino acids and multivitamins at Fuel & Nutrients.",
  path: "/search",
  noIndex: true,
  follow: true,
});

export default function Page() {
  return <Search />;
}
