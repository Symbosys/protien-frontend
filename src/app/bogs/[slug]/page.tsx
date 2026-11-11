import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import BlogDetail from "@/pages/BlogDetail";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  return buildPageMetadata({
    title: "Nutrition & Fitness Article",
    description:
      "Read fitness, nutrition, and supplement articles on Fuel & Nutrients.",
    path: `/blog/${encodeURIComponent(params.slug)}`,
    noIndex: true,
    follow: true,
  });
}

export default function Page() {
  return <BlogDetail />;
}
