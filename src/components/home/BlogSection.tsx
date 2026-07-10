"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useBlogsQuery, DBBlog } from "@/api/hooks/blog.hooks";
import { apiClient } from "@/api/apiclient/apiClient";

interface BlogItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

export default function BlogSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading } = useBlogsQuery({ limit: 6, isActive: true });

  if (isLoading) return null;

  const rawBlogs = data?.blogs || [];

  if (rawBlogs.length === 0) return null;

  const processImageUrl = (url: string | null) => {
    if (!url) return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    
    // Extract base URL from apiClient configuration
    const clientBaseUrl = apiClient.defaults.baseURL || "";
    const baseUrl = clientBaseUrl.replace("/api", "") || "http://192.168.1.2:4000";
    
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const activeBlogPosts: BlogItem[] = rawBlogs.map((b: DBBlog) => {
    // Determine category from tags array, fallback to General
    const category = Array.isArray(b.tags) && b.tags.length > 0 && typeof b.tags[0] === "string"
      ? b.tags[0]
      : "General";

    return {
      id: b.id,
      category,
      title: b.title,
      excerpt: b.excerpt || "",
      image: processImageUrl(b.image),
      slug: b.slug,
    };
  });


  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="heading-bold text-3xl sm:text-4xl lg:text-5xl text-gray-300 italic" style={{ fontStyle: 'italic' }}>
              OUR
            </h2>
            <h2 className="heading-bold text-3xl sm:text-4xl lg:text-5xl text-black">
              BLOG
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-black hover:text-[#5BBF3D] transition-colors group"
          >
            View All Posts
            <span className="w-8 h-8 rounded-full border-2 border-black group-hover:border-[#8CFF64] flex items-center justify-center transition-colors">
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* Blog Cards - Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto hide-scrollbar pb-4"
        >
          {activeBlogPosts.map((post: BlogItem, index: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="min-w-[240px] sm:min-w-[280px] max-w-[300px] flex-shrink-0 group"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[16/10] w-full">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Category Tag */}
                  <span className="absolute bottom-3 left-3 bg-white text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-bold text-sm sm:text-base text-black mb-2 leading-snug group-hover:text-[#2D7D46] transition-colors uppercase">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
