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

type SearchParamsRecord = Record<string, string | string[] | undefined>;

function getParam(
  sp: SearchParamsRecord | undefined,
  ...keys: string[]
): string | undefined {
  if (!sp) return undefined;
  for (const key of keys) {
    const val = sp[key];
    if (typeof val === "string" && val.trim() !== "") return val.trim();
    if (Array.isArray(val) && typeof val[0] === "string" && val[0].trim() !== "") {
      return val[0].trim();
    }
  }
  return undefined;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsRecord;
}): Promise<Metadata> {
  const category = getParam(searchParams, "category");
  const subCategory = getParam(searchParams, "subcategory", "subCategory");
  const brandId = getParam(searchParams, "brandId");
  const goal = getParam(searchParams, "goal");
  const search = getParam(searchParams, "search", "q", "query", "searchQuery");

  let brandName: string | undefined;
  if (brandId) {
    const brandsRes = await fetchBrandsServer({ limit: 100 });
    brandName = brandsRes?.brands?.find((b) => b.id === brandId)?.name;
  }

  let title = "Shop All Protein, Creatine, Pre-Workout & Supplements Online India";
  let description =
    "Browse 100% authentic whey protein, whey isolate, creatine monohydrate, pre-workout, BCAA, EAA, multivitamins & healthy nutrition snacks at Fuel & Nutrients (M/S Protein and Nutrients). Free pan-India shipping, COD & 5% off prepaid via code prepaid5.";
  let canonicalPath = "/products";
  let noIndex = false;

  if (search) {
    title = `Search Results for "${search}" — Sports Supplements`;
    description = `Explore authentic supplements matching "${search}" at ${BRAND.name} (${BRAND.legalName}). Free delivery across India & COD available.`;
    noIndex = true;
  } else if (category) {
    title = `Buy ${category} Online India — 100% Authentic & Lab-Tested`;
    description = `Shop genuine ${category}${subCategory ? ` (${subCategory})` : ""} supplements online in India at ${BRAND.name}. Guaranteed authenticity, free pan-India shipping, Cash on Delivery & 5% off prepaid orders with code prepaid5.`;
    canonicalPath = `/products?category=${encodeURIComponent(category)}`;
  } else if (brandName) {
    title = `Buy ${brandName} Supplements Online India — Authorized Store`;
    description = `Shop 100% original ${brandName} whey protein, creatine, amino acids, and fitness supplements at ${BRAND.name}. Direct sourcing, free pan-India delivery & COD.`;
    canonicalPath = `/products?brandId=${encodeURIComponent(brandId!)}`;
  } else if (goal) {
    title = `Supplements for ${goal} — Protein, Strength & Nutrition`;
    description = `Discover lab-tested supplements for ${goal} at ${BRAND.name} (${BRAND.legalName}). Free delivery across India & 5% prepaid discount with code prepaid5.`;
  }

  return buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    noIndex,
    follow: true,
    keywords: [
      ...(category ? [`buy ${category} online India`, `${category} price India`] : []),
      ...(brandName ? [`${brandName} India`, `buy ${brandName} supplements`] : []),
      ...(goal ? [`${goal} supplements India`] : []),
    ],
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParamsRecord;
}) {
  const category = getParam(searchParams, "category");
  const subCategory = getParam(searchParams, "subcategory", "subCategory");
  const brandId = getParam(searchParams, "brandId");
  const karat = getParam(searchParams, "karat");
  const weight = getParam(searchParams, "weight");
  const priceRange = getParam(searchParams, "priceRange");
  const stock = getParam(searchParams, "stock");
  const search = getParam(searchParams, "search", "q", "query", "searchQuery");
  const sort = (getParam(searchParams, "sort") || "newest") as GetProductsParams["sort"];

  const infiniteParams: Omit<GetProductsParams, "page"> = {
    limit: 20,
    category,
    subCategory,
    brandId,
    karat,
    weight,
    priceRange,
    stock,
    search,
    sort,
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
    name: category
      ? `${category} Supplements — ${BRAND.name}`
      : `All Sports Nutrition & Supplements — ${BRAND.name}`,
    url: category
      ? `${SITE_URL}/products?category=${encodeURIComponent(category)}`
      : `${SITE_URL}/products`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    ...(category
      ? [
          {
            name: category,
            path: `/products?category=${encodeURIComponent(category)}`,
          },
        ]
      : []),
  ]);

  const itemList =
    productsList.length > 0
      ? buildItemListSchema(
          category ? `${category} Products` : "Supplement Catalog",
          "/products",
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
