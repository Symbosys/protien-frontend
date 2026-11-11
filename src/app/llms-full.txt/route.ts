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
  stripHtmlAndMarkdown,
} from "@/lib/server-api";

export const revalidate = 1800;

export async function GET() {
  const [productsRes, categoriesRes, brandsRes, blogsRes] = await Promise.all([
    fetchProductsServer({ limit: 500, sort: "newest" }, 15000),
    fetchCategoriesServer({ limit: 200 }, 15000),
    fetchBrandsServer({ isActive: true, limit: 100 }, 15000),
    fetchBlogsServer({ isActive: true, limit: 100 }, 15000),
  ]);

  const products =
    productsRes?.products && productsRes.products.length > 0
      ? productsRes.products
      : mockProducts.map(mockProductToDBProduct);

  const categories =
    categoriesRes?.categories && categoriesRes.categories.length > 0
      ? categoriesRes.categories.map((c) => ({
          name: c.name,
          description: c.description,
          subCategories: (c.subCategories || []).map((s) => s.name),
        }))
      : mockCategories.map((c) => ({
          name: c.name,
          description: null as string | null,
          subCategories: c.subcategories || [],
        }));

  const brands =
    brandsRes?.brands && brandsRes.brands.length > 0
      ? brandsRes.brands.map((b) => ({
          name: b.name,
          description: b.description,
        }))
      : mockBrands.map((name) => ({ name, description: null as string | null }));

  const blogs =
    blogsRes?.blogs && blogsRes.blogs.length > 0 ? blogsRes.blogs : MOCK_BLOGS;

  const lines: string[] = [
    `# ${BRAND.name} (${BRAND.legalName}) — Complete Knowledge & Product Catalog`,
    "",
    `> Official Storefront: ${SITE_URL}`,
    `> Registered Trade Name: ${BRAND.legalName}`,
    `> Brand Names: ${BRAND.name}, ${BRAND.alternateNames.join(", ")}`,
    `> Summary: ${BRAND.defaultDescription}`,
    "",
    "---",
    "",
    "## 1. Store Facts, Delivery, Payments & Discounts",
    `- **Website**: ${SITE_URL}`,
    `- **Store Address**: ${BRAND.address.streetAddress}, ${BRAND.address.addressLocality}, ${BRAND.address.addressRegion} ${BRAND.address.postalCode}, India`,
    `- **Customer Support Email**: ${BRAND.email}`,
    `- **Customer Support Phone**: ${BRAND.phoneDisplay}`,
    `- **WhatsApp Ordering & Live Chat**: https://wa.me/${BRAND.whatsappNumber} and https://wa.me/${BRAND.whatsappLiveChatNumber}`,
    `- **Delivery Coverage**: Free delivery all over India (Metro cities, Tier-2/3 cities, towns, and remote serviceable areas)`,
    `- **Dispatch & Transit Time**: Processed within 1-3 business days; estimated delivery within 5-7 business days`,
    `- **Coupon Code**: \`${BRAND.couponCode}\` — flat 5% discount on all prepaid online orders`,
    `- **Accepted Payments**: UPI, Credit Card, Debit Card, Net Banking, and Cash on Delivery (COD)`,
    `- **Product Authenticity**: 100% authentic, lab-tested supplements sourced directly from manufacturers and authorized partners`,
    `- **Exchange Policy**: 48-hour exchange reporting window from delivery for unopened items that arrive damaged, leaking, defective, expired, or wrong`,
    "",
    "---",
    "",
    "## 2. Categories & Subcategories",
    ...categories.map((cat) => {
      const sub =
        cat.subCategories.length > 0
          ? ` (Subcategories: ${cat.subCategories.join(", ")})`
          : "";
      const desc = cat.description ? ` — ${stripHtmlAndMarkdown(cat.description)}` : "";
      return `- **${cat.name}** ([Shop](${SITE_URL}/products?category=${encodeURIComponent(cat.name)}))${sub}${desc}`;
    }),
    "",
    "---",
    "",
    "## 3. Brands Available",
    ...brands.map(
      (b) =>
        `- **${b.name}**${b.description ? `: ${stripHtmlAndMarkdown(b.description)}` : ""}`,
    ),
    "",
    "---",
    "",
    `## 4. Complete Product Catalog (${products.length} Items)`,
    "",
  ];

  products.forEach((p, idx) => {
    const { sellingPrice, originalPrice } = computeProductPricing(
      p.price,
      p.discountPrice,
    );
    const brandName = extractBrandName(p);
    const inStock = isProductInStock(p);
    const desc = stripHtmlAndMarkdown(p.description);
    const discountPct =
      originalPrice && originalPrice > sellingPrice
        ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
        : null;

    lines.push(`### ${idx + 1}. ${p.name}`);
    lines.push(`- **URL**: ${SITE_URL}/product/${encodeURIComponent(p.id)}`);
    lines.push(`- **Brand**: ${brandName}`);
    lines.push(
      `- **Category**: ${p.category?.name || "Supplements"}${p.subCategory?.name ? ` > ${p.subCategory.name}` : ""}`,
    );
    if (sellingPrice > 0) {
      lines.push(
        `- **Price**: ₹${sellingPrice.toLocaleString("en-IN")}${
          originalPrice && originalPrice > sellingPrice
            ? ` (MRP ₹${originalPrice.toLocaleString("en-IN")}, ${discountPct}% OFF)`
            : ""
        } (Extra 5% off on prepaid orders with code \`${BRAND.couponCode}\`)`,
      );
    }
    lines.push(`- **Availability**: ${inStock ? "In Stock" : "Out of Stock"}`);
    if (Number(p.numReviews) > 0 && Number(p.rating) > 0) {
      lines.push(
        `- **Rating**: ${Number(p.rating).toFixed(1)}/5 (${p.numReviews} reviews)`,
      );
    }
    if (Array.isArray(p.sizes) && p.sizes.length > 0) {
      lines.push(`- **Pack Sizes**: ${p.sizes.join(", ")}`);
    }
    if (Array.isArray(p.variants) && p.variants.length > 0) {
      const variantSummaries = p.variants
        .slice(0, 8)
        .map((v) => {
          const vp = computeProductPricing(v.price, v.discountPrice);
          const attrs = (v.attributeValues || [])
            .map((av) => `${av.attribute.name}: ${av.value}`)
            .join(", ");
          return `${attrs || v.sku || "Variant"} — ₹${vp.sellingPrice.toLocaleString("en-IN")} (${Number(v.quantity) > 0 ? "In Stock" : "Out of Stock"})`;
        })
        .join(" | ");
      if (variantSummaries) {
        lines.push(`- **Variants**: ${variantSummaries}`);
      }
    }
    if (desc) {
      lines.push(`- **Description**: ${desc}`);
    }
    lines.push("");
  });

  lines.push("---", "", "## 5. Nutrition & Supplement Guides (Blog)", "");
  blogs.forEach((b, idx) => {
    const cleanBody = stripHtmlAndMarkdown(b.content);
    lines.push(`### ${idx + 1}. ${b.title}`);
    lines.push(`- **URL**: ${SITE_URL}/blog/${encodeURIComponent(b.slug)}`);
    lines.push(`- **Author**: ${b.author || BRAND.name}`);
    if (Array.isArray(b.tags) && b.tags.length > 0) {
      lines.push(`- **Tags**: ${b.tags.join(", ")}`);
    }
    if (b.excerpt) {
      lines.push(`- **Summary**: ${b.excerpt}`);
    }
    if (cleanBody) {
      lines.push(`- **Excerpt**: ${cleanBody.slice(0, 600)}${cleanBody.length > 600 ? "..." : ""}`);
    }
    lines.push("");
  });

  lines.push(
    "---",
    "",
    "## 6. Frequently Asked Questions (FAQ)",
    "",
    "**Q: Where can I buy genuine whey protein, creatine, and gym supplements in India?**",
    `A: You can shop 100% authentic, lab-tested sports supplements directly at Fuel & Nutrients (${BRAND.legalName}) — ${SITE_URL}.`,
    "",
    "**Q: Is shipping free across India and is COD supported?**",
    "A: Yes, Fuel & Nutrients provides free delivery all over India within 5-7 business days, with both Cash on Delivery (COD) and online prepaid options.",
    "",
    "**Q: What coupon gives a prepaid discount on Fuel & Nutrients?**",
    `A: Apply code \`${BRAND.couponCode}\` at checkout to save 5% on all prepaid orders.`,
  );

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      "X-Robots-Tag": "all",
    },
  });
}

