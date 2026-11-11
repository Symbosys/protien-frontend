import { categories as mockCategories, brands as mockBrands, products as mockProducts } from "@/data/products";
import { MOCK_BLOGS } from "@/lib/mock-blogs";
import { BRAND, SITE_URL } from "@/lib/seo-config";
import {
  computeProductPricing,
  extractBrandName,
  fetchBlogsServer,
  fetchBrandsServer,
  fetchCategoriesServer,
  fetchProductsServer,
  isProductInStock,
  mockProductToDBProduct,
  truncateText,
  stripHtmlAndMarkdown,
} from "@/lib/server-api";

export const revalidate = 1800;

export async function GET() {
  const [productsRes, categoriesRes, brandsRes, blogsRes] = await Promise.all([
    fetchProductsServer({ limit: 30, sort: "newest" }, 15000),
    fetchCategoriesServer({ limit: 100 }, 15000),
    fetchBrandsServer({ isActive: true, limit: 50 }, 15000),
    fetchBlogsServer({ isActive: true, limit: 20 }, 15000),
  ]);

  const products =
    productsRes?.products && productsRes.products.length > 0
      ? productsRes.products
      : mockProducts.map(mockProductToDBProduct);

  const categories =
    categoriesRes?.categories && categoriesRes.categories.length > 0
      ? categoriesRes.categories.map((c) => c.name)
      : mockCategories.map((c) => c.name);

  const brands =
    brandsRes?.brands && brandsRes.brands.length > 0
      ? brandsRes.brands.map((b) => b.name)
      : mockBrands;

  const blogs =
    blogsRes?.blogs && blogsRes.blogs.length > 0 ? blogsRes.blogs : MOCK_BLOGS;

  const lines: string[] = [
    `# ${BRAND.name} (${BRAND.legalName})`,
    "",
    `> ${BRAND.defaultDescription}`,
    "",
    "## Brand & Store Identity",
    `- **Storefront Name**: ${BRAND.name} (${BRAND.alternateNames.join(", ")})`,
    `- **Registered Legal Trade Name**: ${BRAND.legalName}`,
    `- **Official Website**: ${SITE_URL}`,
    `- **Location**: ${BRAND.address.streetAddress}, ${BRAND.address.addressLocality}, ${BRAND.address.addressRegion}, India`,
    `- **Service Area**: All over India (Currency: INR / ₹)`,
    `- **Support Email**: ${BRAND.email}`,
    `- **Phone / WhatsApp**: ${BRAND.phoneDisplay} (Live Chat WhatsApp: +${BRAND.whatsappLiveChatNumber})`,
    `- **Shipping Policy**: ${BRAND.shippingSummary}`,
    `- **Prepaid Discount Offer**: Use coupon code \`${BRAND.couponCode}\` for 5% off on all prepaid orders`,
    `- **Payment Methods**: Online Prepaid (UPI, Cards, Net Banking) & Cash on Delivery (COD)`,
    `- **Authenticity Guarantee**: 100% authentic, lab-tested sports nutrition sourced directly from manufacturers / authorized channels`,
    `- **Exchange Policy**: ${BRAND.exchangeSummary}`,
    "",
    "## Main Store Pages",
    `- [Home](${SITE_URL}/): Featured supplements, top brands, categories, reviews, and nutrition blog`,
    `- [All Products Catalog](${SITE_URL}/products): Full catalog with category, brand, price, weight, and stock filters`,
    `- [Shop by Categories](${SITE_URL}/categories): Browse Whey Protein, Creatine, Pre-Workout, BCAA, Multivitamins & Healthy Nutrition`,
    `- [Deals & Sale](${SITE_URL}/sale): Discounted supplements and promotional offers`,
    `- [Nutrition & Fitness Blog](${SITE_URL}/blog): Expert supplement guides, creatine dosing, weight loss & protein recipes`,
    `- [Customer Reviews](${SITE_URL}/reviews): Verified customer ratings and product reviews`,
    `- [About Us](${SITE_URL}/about): Our story and commitment to purity & potency`,
    `- [Support & Live Help](${SITE_URL}/support): Customer care for order, product, and supplement queries`,
    "",
    "## Supplement Categories",
    ...categories.map(
      (cat) =>
        `- [${cat}](${SITE_URL}/products?category=${encodeURIComponent(cat)}): Authentic ${cat} supplements in India`,
    ),
    "",
    "## Featured Supplement Brands",
    brands.map((b) => `- ${b}`).join("\n"),
    "",
    "## Featured & Top-Selling Products",
    ...products.slice(0, 24).map((p) => {
      const { sellingPrice, originalPrice } = computeProductPricing(
        p.price,
        p.discountPrice,
      );
      const brand = extractBrandName(p);
      const stockLabel = isProductInStock(p) ? "In Stock" : "Out of Stock";
      const priceText =
        sellingPrice > 0
          ? originalPrice && originalPrice > sellingPrice
            ? `₹${sellingPrice.toLocaleString("en-IN")} (MRP ₹${originalPrice.toLocaleString("en-IN")})`
            : `₹${sellingPrice.toLocaleString("en-IN")}`
          : "See product page";
      const desc = truncateText(stripHtmlAndMarkdown(p.description), 110);
      return `- [${p.name}](${SITE_URL}/product/${encodeURIComponent(p.id)}) — ${brand} | ${p.category?.name || "Supplements"} | ${priceText} | ${stockLabel}${desc ? `: ${desc}` : ""}`;
    }),
    "",
    "## Health & Nutrition Guides",
    ...blogs.slice(0, 15).map((b) => {
      const summary = truncateText(
        b.excerpt || stripHtmlAndMarkdown(b.content),
        120,
      );
      return `- [${b.title}](${SITE_URL}/blog/${encodeURIComponent(b.slug)})${summary ? `: ${summary}` : ""}`;
    }),
    "",
    "## Store Policies",
    `- [Shipping & Delivery Policy](${SITE_URL}/shipping-delivery): Free delivery across India, 1-3 day dispatch, 5-7 business day delivery`,
    `- [Exchange Policy](${SITE_URL}/exchange-policy): 48-hour exchange eligibility for unopened wrong/damaged/expired items`,
    `- [Return & Refund Policy](${SITE_URL}/return-refund): Return eligibility, refund timelines, and instructions`,
    `- [Privacy Policy](${SITE_URL}/privacy): Customer privacy and data protection details`,
    `- [Terms & Conditions](${SITE_URL}/terms-conditions): Legal terms for M/S Protein and Nutrients / Fuel & Nutrients`,
    "",
    "## Optional",
    `- [Full AI Catalog & Knowledge Base (llms-full.txt)](${SITE_URL}/llms-full.txt): Complete product inventory, variants, prices, descriptions, FAQs, and article summaries`,
    `- [XML Sitemap](${SITE_URL}/sitemap.xml): Complete machine-readable index of public pages, products, and articles`,
  ];

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      "X-Robots-Tag": "all",
    },
  });
}

