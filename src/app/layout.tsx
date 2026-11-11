import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Suspense } from "react";
// @ts-ignore: Allow importing global CSS without type declarations
import "./globals.css";
import Providers from "./providers";
import JsonLd from "@/components/seo/JsonLd";
import {
  BRAND,
  CORE_KEYWORDS,
  SITE_URL,
  buildAlternates,
} from "@/lib/seo-config";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo-schema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND.defaultTitle,
    template: BRAND.titleTemplate,
  },
  description: BRAND.defaultDescription,
  applicationName: BRAND.name,
  keywords: CORE_KEYWORDS,
  authors: [{ name: BRAND.legalName, url: SITE_URL }],
  creator: BRAND.legalName,
  publisher: BRAND.legalName,
  category: "Health & Sports Nutrition",
  classification: "Sports Nutrition, Dietary Supplements & Whey Protein Store",
  alternates: buildAlternates("/"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND.name,
    locale: "en_IN",
    title: BRAND.defaultTitle,
    description: BRAND.defaultDescription,
    images: [
      {
        url: BRAND.ogImage,
        width: 1024,
        height: 1024,
        alt: `${BRAND.name} (${BRAND.legalName}) — Authentic Sports Nutrition India`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.defaultTitle,
    description: BRAND.defaultDescription,
    images: [BRAND.ogImage],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  ...(googleVerification
    ? {
        verification: {
          google: googleVerification,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={buildOrganizationSchema()} />
        <JsonLd data={buildWebSiteSchema()} />
        <Providers>
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#111111] flex items-center justify-center text-xs uppercase tracking-widest text-[#FFF] animate-pulse">
                Loading Protein and Nutrients...
              </div>
            }
          >
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
