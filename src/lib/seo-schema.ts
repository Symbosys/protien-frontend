import type { DBBlog } from "@/api/hooks/blog.hooks";
import type { DBProduct } from "@/api/hooks/product.hooks";
import { BRAND, SITE_URL } from "@/lib/seo-config";
import {
  computeProductPricing,
  extractBrandName,
  getProductImages,
  isProductInStock,
  resolveMediaUrl,
  stripHtmlAndMarkdown,
} from "@/lib/server-api";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Store"],
    "@id": ORG_ID,
    name: BRAND.name,
    legalName: BRAND.legalName,
    alternateName: [...BRAND.alternateNames],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: BRAND.logoUrl,
      width: 1024,
      height: 1024,
    },
    image: BRAND.ogImage,
    description: BRAND.defaultDescription,
    email: BRAND.email,
    telephone: BRAND.phoneE164,
    priceRange: "₹₹",
    currenciesAccepted: BRAND.currency,
    paymentAccepted: "Cash on Delivery, UPI, Credit Card, Debit Card, Net Banking",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.address.streetAddress,
      addressLocality: BRAND.address.addressLocality,
      addressRegion: BRAND.address.addressRegion,
      postalCode: BRAND.address.postalCode,
      addressCountry: BRAND.address.addressCountry,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BRAND.phoneE164,
        contactType: "customer service",
        email: BRAND.email,
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory:
        "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 2,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: BRAND.name,
    alternateName: [...BRAND.alternateNames],
    description: BRAND.defaultDescription,
    inLanguage: "en-IN",
    publisher: {
      "@id": ORG_ID,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => {
      const normalized = item.path.startsWith("http")
        ? item.path
        : `${SITE_URL}${item.path.startsWith("/") ? "" : "/"}${item.path}`;
      return {
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        item: normalized === `${SITE_URL}/` ? SITE_URL : normalized,
      };
    }),
  };
}

export function buildItemListSchema(
  name: string,
  path: string,
  items: Array<{ name: string; url: string; image?: string; price?: number }>,
) {
  const fullUrl = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: fullUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}

export function buildFaqSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildHomeFaqSchema() {
  return buildFaqSchema([
    {
      question: "Where can I buy 100% authentic whey protein and gym supplements online in India?",
      answer:
        "You can buy 100% authentic, lab-tested whey protein, whey isolate, creatine monohydrate, pre-workout, BCAA, EAA, mass gainers, multivitamins, and high-protein snacks online at Fuel & Nutrients (M/S Protein and Nutrients) via https://fuelandnutrients.com. Products are sourced directly from manufacturers and GMP-certified brands.",
    },
    {
      question: "Does Fuel & Nutrients offer free shipping and Cash on Delivery (COD) across India?",
      answer:
        "Yes. Fuel & Nutrients offers free delivery all over India. Orders are typically processed within 1 to 3 business days and delivered within 5 to 7 business days. Both Cash on Delivery (COD) and online prepaid payments are supported.",
    },
    {
      question: "Is there any prepaid discount coupon code on Fuel & Nutrients?",
      answer:
        "Yes, customers get a flat 5% discount on all prepaid online orders by applying coupon code prepaid5 during checkout at fuelandnutrients.com.",
    },
    {
      question: "Which top supplement brands are available on Fuel & Nutrients?",
      answer:
        "Fuel & Nutrients features leading sports nutrition brands including Optimum Nutrition, MuscleTech, MuscleBlaze, Avvatar, HK Vitals, Pintola, Wellversed, and more.",
    },
    {
      question: "What is the exchange and support policy for damaged or wrong supplements?",
      answer:
        "Unopened, unused products in original packaging qualify for exchange within 48 hours of delivery if damaged, leaking, defective, expired, or incorrect. Support is available at support@protein-and-nutrients.com or +91 7759957841.",
    },
  ]);
}

export function buildProductSchema(product: DBProduct) {
  const productUrl = `${SITE_URL}/product/${encodeURIComponent(product.id)}`;
  const { sellingPrice, originalPrice } = computeProductPricing(
    product.price,
    product.discountPrice,
  );
  const images = getProductImages(product);
  const brandName = extractBrandName(product);
  const inStock = isProductInStock(product);
  const cleanDescription =
    stripHtmlAndMarkdown(product.description) ||
    `${product.name} by ${brandName}. Authentic sports nutrition supplement available in India at ${BRAND.name} (${BRAND.legalName}) with free delivery and COD.`;

  // Compute min/max price across variants if available
  const variantPrices = (product.variants || [])
    .map((v) => computeProductPricing(v.price, v.discountPrice).sellingPrice)
    .filter((n) => n > 0);
  const effectivePrice =
    variantPrices.length > 0 && sellingPrice === 0
      ? Math.min(...variantPrices)
      : sellingPrice;

  const reviewCount = Number(product.numReviews) || (product.reviews?.length ?? 0);
  const ratingValue = Number(product.rating) || 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: cleanDescription,
    image: images,
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    url: productUrl,
    category: product.category?.name || "Sports Nutrition & Supplements",
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: BRAND.currency,
      price: effectivePrice > 0 ? effectivePrice : undefined,
      ...(originalPrice && originalPrice > effectivePrice
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: originalPrice,
              priceCurrency: BRAND.currency,
            },
          }
        : {}),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@id": ORG_ID,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: BRAND.currency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 5,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 2,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    ...(reviewCount > 0 && ratingValue > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Math.min(5, Math.max(1, Number(ratingValue.toFixed(1)))),
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(product.reviews && product.reviews.length > 0
      ? {
          review: product.reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
            author: {
              "@type": "Person",
              name:
                `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() ||
                "Verified Customer",
            },
            reviewBody: r.comment,
            datePublished: r.createdAt,
          })),
        }
      : {}),
  };
}

export function buildProductFaqSchema(product: DBProduct) {
  const brandName = extractBrandName(product);
  return buildFaqSchema([
    {
      question: `Is ${product.name} sold on Fuel & Nutrients genuine and authentic?`,
      answer: `Yes. ${product.name} by ${brandName} on Fuel & Nutrients (M/S Protein and Nutrients) is 100% authentic, sourced directly from authorized channels and manufacturers with strict quality standards.`,
    },
    {
      question: `How fast is delivery for ${product.name} in India and is shipping free?`,
      answer: `Fuel & Nutrients offers free delivery all over India. Orders are processed within 1-3 business days and typically delivered in 5-7 business days with tracking sent via email, SMS, or WhatsApp.`,
    },
    {
      question: `Can I pay via Cash on Delivery or get a prepaid discount on ${product.name}?`,
      answer: `Yes, Cash on Delivery (COD) is available across India, and you can get 5% off prepaid online orders using coupon code ${BRAND.couponCode} at checkout.`,
    },
  ]);
}

export function buildBlogPostingSchema(blog: DBBlog) {
  const url = `${SITE_URL}/blog/${encodeURIComponent(blog.slug)}`;
  const imageUrl = resolveMediaUrl(blog.image, BRAND.ogImage);
  const plainBody = stripHtmlAndMarkdown(blog.content);
  const description =
    blog.excerpt || plainBody.slice(0, 200) || blog.title;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: blog.title,
    description,
    articleBody: plainBody || description,
    image: [imageUrl],
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    inLanguage: "en-IN",
    author: {
      "@type": "Person",
      name: blog.author || BRAND.name,
    },
    publisher: {
      "@id": ORG_ID,
    },
    ...(Array.isArray(blog.tags) && blog.tags.length > 0
      ? {
          keywords: blog.tags.join(", "),
          articleSection: blog.tags[0],
        }
      : {}),
    ...(blog.readTime
      ? {
          timeRequired: `PT${Math.max(1, Math.round(blog.readTime))}M`,
        }
      : {}),
  };
}

