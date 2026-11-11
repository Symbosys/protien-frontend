import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fuelandnutrients.com"
).replace(/\/+$/, "");

export const BACKEND_API_URL = (
  process.env.NEXT_PUBLIC_API_URL &&
  process.env.NEXT_PUBLIC_API_URL.startsWith("http")
    ? process.env.NEXT_PUBLIC_API_URL
    : "https://protien-backend.vercel.app/api"
).replace(/\/+$/, "");

export const BACKEND_ORIGIN = BACKEND_API_URL.replace(/\/api$/, "");

export const BRAND = {
  name: "Fuel & Nutrients",
  shortName: "P&N",
  legalName: "M/S Protein and Nutrients",
  alternateNames: [
    "Fuel and Nutrients",
    "Protein and Nutrients",
    "M/S Protein and Nutrients",
    "P&N",
  ],
  tagline: "Premium Sports Nutrition & Authentic Supplements India",
  defaultTitle:
    "Fuel & Nutrients (Protein and Nutrients) | Buy Authentic Whey Protein, Creatine & Supplements Online India",
  titleTemplate: "%s | Fuel & Nutrients",
  defaultDescription:
    "Shop 100% authentic, lab-tested whey protein, whey isolate, creatine monohydrate, pre-workout, BCAA, EAA, mass gainer, multivitamins & high-protein snacks online at Fuel & Nutrients (M/S Protein and Nutrients). Free pan-India delivery, Cash on Delivery (COD) & 5% off prepaid orders with code prepaid5.",
  email: "support@protein-and-nutrients.com",
  phoneDisplay: "+91 7759957841",
  phoneE164: "+917759957841",
  whatsappNumber: "917759957841",
  whatsappLiveChatNumber: "916200065378",
  address: {
    streetAddress: "Ratu Road, Ranchi - 5",
    addressLocality: "Ranchi",
    addressRegion: "Jharkhand",
    postalCode: "834005",
    addressCountry: "IN",
  },
  currency: "INR",
  couponCode: "prepaid5",
  couponDiscountText: "5% off on all prepaid orders using code prepaid5",
  shippingSummary: "Free delivery all over India (1-3 business days processing, 5-7 business days delivery)",
  exchangeSummary: "48-hour exchange window from delivery for unopened wrong, damaged, leaking, or expired products",
  foundedYear: "2026",
  ogImage: `${SITE_URL}/logo.png`,
  logoUrl: `${SITE_URL}/logo.png`,
} as const;

export const CORE_KEYWORDS: string[] = [
  "Fuel and Nutrients",
  "Fuel & Nutrients",
  "Protein and Nutrients",
  "M/S Protein and Nutrients",
  "fuelandnutrients.com",
  "buy whey protein online India",
  "authentic sports nutrition India",
  "lab tested supplements India",
  "creatine monohydrate India",
  "whey protein isolate online",
  "pre workout supplements India",
  "BCAA EAA amino acids",
  "mass gainer India",
  "Optimum Nutrition India",
  "MuscleBlaze",
  "MuscleTech",
  "HK Vitals",
  "Avvatar Whey",
  "Pintola peanut butter",
  "high protein oats",
  "free delivery supplements India",
  "supplement store Ranchi",
];

export function buildAlternates(canonicalPath: string): NonNullable<Metadata["alternates"]> {
  const normalizedPath = canonicalPath.startsWith("/")
    ? canonicalPath
    : `/${canonicalPath}`;
  return {
    canonical: normalizedPath === "/" ? "/" : normalizedPath,
    types: {
      "text/plain": [
        {
          url: "/llms.txt",
          title: "LLMs.txt AI Agent Directory - Fuel & Nutrients",
        },
      ],
    },
  };
}

export interface BuildPageMetadataOptions {
  title: string;
  absoluteTitle?: boolean;
  description: string;
  path: string;
  keywords?: string[];
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  noIndex?: boolean;
  follow?: boolean;
  openGraphType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  other?: Record<string, string | number | Array<string | number>>;
}

export function buildPageMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
  keywords = [],
  images,
  noIndex = false,
  follow = true,
  openGraphType = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
  other,
}: BuildPageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = normalizedPath === "/" ? SITE_URL : `${SITE_URL}${normalizedPath}`;
  const ogImages =
    images && images.length > 0
      ? images
      : [
          {
            url: BRAND.ogImage,
            width: 1024,
            height: 1024,
            alt: `${BRAND.name} (${BRAND.legalName}) Logo`,
          },
        ];

  const openGraph: Metadata["openGraph"] =
    openGraphType === "article"
      ? {
          type: "article",
          url: fullUrl,
          siteName: BRAND.name,
          locale: "en_IN",
          title,
          description,
          images: ogImages,
          publishedTime,
          modifiedTime,
          authors,
          tags,
        }
      : {
          type: "website",
          url: fullUrl,
          siteName: BRAND.name,
          locale: "en_IN",
          title,
          description,
          images: ogImages,
        };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: Array.from(new Set([...keywords, ...CORE_KEYWORDS])),
    alternates: buildAlternates(normalizedPath),
    robots: noIndex
      ? {
          index: false,
          follow,
          googleBot: {
            index: false,
            follow,
          },
        }
      : {
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
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
    ...(other ? { other } : {}),
  };
}
