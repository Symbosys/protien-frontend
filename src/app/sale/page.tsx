import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { brandKeys } from "@/api/hooks/brand.hooks";
import { productKeys, type GetProductsParams } from "@/api/hooks/product.hooks";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, SITE_URL, buildPageMetadata } from "@/lib/seo-config";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo-schema";
import {
  computeProductPricing,
  fetchBrandsServer,
  fetchProductsServer,
  getProductImages,
} from "@/lib/server-api";
import Products from "@/pages/Products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Supplements Sale & Deals — Save Up to 40% + Extra 5% Off Prepaid",
  description:
    "Grab limited-time deals on authentic whey protein, creatine, pre-workout, amino acids & multivitamins at Fuel & Nutrients (M/S Protein and Nutrients). Free pan-India shipping & extra 5% off prepaid via code prepaid5.",
  path: "/sale",
  keywords: [
    "whey protein sale India",
    "supplement deals online India",
    "prepaid5 coupon Fuel and Nutrients",
    "best price protein powder India",
  ],
});

export default async function SalePage() {
  const infiniteParams: Omit<GetProductsParams, "page"> = {
    limit: 20,
    sort: "newest",
  };

  const queryClient = makeServerQueryClient();
  const [firstPageProductsRes] = await Promise.all([
    fetchProductsServer({ ...infiniteParams, page: 1 }),
  ]);

  await Promise.allSettled([
    prefetchChromeCategories(queryClient),
    queryClient.prefetchQuery({
      queryKey: brandKeys.list({ limit: 100 }),
      queryFn: async () => {
        const res = await fetchBrandsServer({ limit: 100 });
        if (!res) throw new Error("Failed to fetch brands");
        return res;
      },
    }),
    firstPageProductsRes
      ? queryClient.prefetchInfiniteQuery({
          queryKey: productKeys.infiniteList(infiniteParams),
          queryFn: async () => firstPageProductsRes,
          initialPageParam: 1,
        })
      : Promise.resolve(),
  ]);

  const productsList = firstPageProductsRes?.products || [];
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Supplement Offers & Deals — ${BRAND.name}`,
    url: `${SITE_URL}/sale`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Sale & Deals", path: "/sale" },
  ]);
  const itemList =
    productsList.length > 0
      ? buildItemListSchema(
          "Supplement Sale & Top Deals",
          "/sale",
          productsList.slice(0, 20).map((p) => ({
            name: p.name,
            url: `/product/${encodeURIComponent(p.id)}`,
            image: getProductImages(p)[0],
            price: computeProductPricing(p.price, p.discountPrice).sellingPrice,
          })),
        )
      : null;

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbs} />
      {itemList && <JsonLd data={itemList} />}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Products />
      </HydrationBoundary>
    </>
  );
}
