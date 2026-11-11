import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/seo-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} — ${BRAND.legalName}`,
    short_name: BRAND.name,
    description: BRAND.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#B5E12E",
    lang: "en-IN",
    categories: ["shopping", "health", "fitness", "sports"],
    icons: [
      {
        src: "/logo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

