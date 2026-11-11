import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { productKeys } from "@/api/hooks/product.hooks";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, buildPageMetadata } from "@/lib/seo-config";
import {
  buildBreadcrumbSchema,
  buildProductFaqSchema,
  buildProductSchema,
} from "@/lib/seo-schema";
import {
  computeProductPricing,
  extractBrandName,
  fetchProductDetailServer,
  fetchProductsServer,
  getProductImages,
  isProductInStock,
  stripHtmlAndMarkdown,
  truncateText,
} from "@/lib/server-api";
import ProductDetail from "@/pages/ProductDetail";

export const revalidate = 300;

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { product } = await fetchProductDetailServer(params.id, true);

  if (!product) {
    return buildPageMetadata({
      title: "Product Not Found",
      description: `Browse 100% authentic whey protein, creatine, pre-workout and sports nutrition supplements at ${BRAND.name}.`,
      path: `/product/${encodeURIComponent(params.id)}`,
      noIndex: true,
      follow: true,
    });
  }

  const { sellingPrice } = computeProductPricing(
    product.price,
    product.discountPrice,
  );
  const brandName = extractBrandName(product);
  const inStock = isProductInStock(product);
  const images = getProductImages(product);
  const cleanDesc = stripHtmlAndMarkdown(product.description);
  const priceLabel =
    sellingPrice > 0 ? ` — ₹${sellingPrice.toLocaleString("en-IN")}` : "";

  const metaDescription = truncateText(
    `${cleanDesc ? `${cleanDesc} ` : ""}Buy ${product.name} by ${brandName} online in India at ${BRAND.name} (${BRAND.legalName}). 100% authentic & lab-tested, free pan-India delivery, COD available, and 5% off prepaid via code ${BRAND.couponCode}.`,
    160,
  );

  return buildPageMetadata({
    title: `Buy ${product.name} (${brandName})${priceLabel}`,
    description: metaDescription,
    path: `/product/${encodeURIComponent(product.id)}`,
    keywords: [
      product.name,
      `buy ${product.name} online India`,
      `${product.name} price`,
      brandName,
      product.category?.name || "Sports Supplements",
    ],
    images: images.map((url) => ({
      url,
      alt: `${product.name} — ${brandName}`,
    })),
    other: {
      ...(sellingPrice > 0
        ? {
            "product:price:amount": String(sellingPrice),
            "product:price:currency": BRAND.currency,
          }
        : {}),
      "product:availability": inStock ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:brand": brandName,
      "product:retailer_item_id": product.id,
    },
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const queryClient = makeServerQueryClient();
  const { product } = await fetchProductDetailServer(params.id, true);

  await Promise.allSettled([
    prefetchChromeCategories(queryClient),
    product
      ? Promise.resolve(
          queryClient.setQueryData(productKeys.detail(params.id), product),
        )
      : Promise.resolve(),
    product?.categoryId
      ? queryClient.prefetchQuery({
          queryKey: productKeys.list({
            categoryId: product.categoryId,
            limit: 8,
          }),
          queryFn: async () => {
            const res = await fetchProductsServer({
              categoryId: product.categoryId,
              limit: 8,
            });
            if (!res) throw new Error("Failed to fetch related products");
            return res;
          },
        })
      : Promise.resolve(),
  ]);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    ...(product?.category?.name
      ? [
          {
            name: product.category.name,
            path: `/products?category=${encodeURIComponent(product.category.name)}`,
          },
        ]
      : []),
    ...(product
      ? [
          {
            name: product.name,
            path: `/product/${encodeURIComponent(product.id)}`,
          },
        ]
      : []),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {product && <JsonLd data={buildProductSchema(product)} />}
      {product && <JsonLd data={buildProductFaqSchema(product)} />}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductDetail />
      </HydrationBoundary>
    </>
  );
}
