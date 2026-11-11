import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { blogKeys } from "@/api/hooks/blog.hooks";
import JsonLd from "@/components/seo/JsonLd";
import {
  makeServerQueryClient,
  prefetchChromeCategories,
} from "@/lib/query-hydration";
import { BRAND, buildPageMetadata } from "@/lib/seo-config";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo-schema";
import {
  fetchBlogDetailServer,
  fetchBlogsServer,
  resolveMediaUrl,
  stripHtmlAndMarkdown,
  truncateText,
} from "@/lib/server-api";
import BlogDetail from "@/pages/BlogDetail";

export const revalidate = 300;

interface BlogDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { blog } = await fetchBlogDetailServer(params.slug, true);

  if (!blog) {
    return buildPageMetadata({
      title: "Article Not Found",
      description: `Read fitness and sports nutrition guides at ${BRAND.name}.`,
      path: `/blog/${encodeURIComponent(params.slug)}`,
      noIndex: true,
      follow: true,
    });
  }

  const imageUrl = resolveMediaUrl(blog.image);
  const plainDesc = truncateText(
    blog.excerpt || stripHtmlAndMarkdown(blog.content) || blog.title,
    160,
  );

  return buildPageMetadata({
    title: blog.title,
    description: plainDesc,
    path: `/blog/${encodeURIComponent(blog.slug)}`,
    keywords: Array.isArray(blog.tags) ? blog.tags : [],
    images: [{ url: imageUrl, alt: blog.title }],
    openGraphType: "article",
    publishedTime: blog.createdAt,
    modifiedTime: blog.updatedAt || blog.createdAt,
    authors: blog.author ? [blog.author] : [BRAND.name],
    tags: Array.isArray(blog.tags) ? blog.tags : undefined,
  });
}

export default async function BlogDetailRoutePage({
  params,
}: BlogDetailPageProps) {
  const queryClient = makeServerQueryClient();
  const { blog } = await fetchBlogDetailServer(params.slug, true);

  await Promise.allSettled([
    prefetchChromeCategories(queryClient),
    blog
      ? Promise.resolve(
          queryClient.setQueryData(blogKeys.detail(params.slug), blog),
        )
      : Promise.resolve(),
    queryClient.prefetchQuery({
      queryKey: blogKeys.list({ isActive: true }),
      queryFn: async () => {
        const res = await fetchBlogsServer({ isActive: true });
        if (!res) throw new Error("Failed to fetch blogs list");
        return res;
      },
    }),
  ]);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    ...(blog
      ? [
          {
            name: blog.title,
            path: `/blog/${encodeURIComponent(blog.slug)}`,
          },
        ]
      : []),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {blog && <JsonLd data={buildBlogPostingSchema(blog)} />}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogDetail />
      </HydrationBoundary>
    </>
  );
}
