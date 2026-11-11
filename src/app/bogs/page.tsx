import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import BlogPage from "@/pages/BlogListPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Fitness, Nutrition & Supplement Guides Blog",
  description:
    "Read nutrition and sports supplement guides at Fuel & Nutrients (M/S Protein and Nutrients).",
  path: "/blog",
  noIndex: true,
  follow: true,
});

export default function Page() {
  return <BlogPage />;
}
