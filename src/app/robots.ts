import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo-config";

const DISALLOWED_PRIVATE_PATHS = [
  "/api/",
  "/account/",
  "/cart",
  "/checkout",
  "/login",
  "/order/",
  "/wishlist",
  "/MyntraOrderPage",
];

const AI_AND_SEARCH_USER_AGENTS = [
  "Googlebot",
  "Google-Extended",
  "GoogleOther",
  "Google-InspectionTool",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-Web",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "Grok",
  "GrokBot",
  "xAI-Grok",
  "Bingbot",
  "msnbot",
  "Applebot",
  "Applebot-Extended",
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "Amazonbot",
  "MistralAI-User",
  "YouBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_AND_SEARCH_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOWED_PRIVATE_PATHS,
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

