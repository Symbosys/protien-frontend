"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    category: "Fitness",
    title: "THE IMPACT OF NUTRITION ON MENTAL HEALTH",
    excerpt: "Mental health and physical health are deeply connected. While exercise, sleep, and lifestyle habits all play an important role...",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop",
    date: "15 Jun 2024",
  },
  {
    id: 2,
    category: "Health",
    title: "HEALTHY WEIGHT LOSS TIPS FOR BEGINNERS",
    excerpt: "Losing weight is one of the most common health goals. Many people struggle because they follow unsustainable diets...",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop",
    date: "08 Jun 2024",
  },
  {
    id: 3,
    category: "Supplements",
    title: "CREATINE: THE COMPLETE GUIDE FOR ATHLETES",
    excerpt: "Creatine is one of the most researched and proven supplements in sports nutrition. Here's everything you need to know...",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop",
    date: "01 Jun 2024",
  },
  {
    id: 4,
    category: "Nutrition",
    title: "HIGH PROTEIN BREAKFAST IDEAS FOR GYM GOERS",
    excerpt: "Starting your day with a protein-rich breakfast sets the foundation for muscle recovery and sustained energy throughout...",
    image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&auto=format&fit=crop",
    date: "25 May 2024",
  },
];

export default function BlogSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="min-w-[280px] sm:min-w-[320px] max-w-[360px] flex-shrink-0 group"
            >
              <Link to="/blog" className="block">
                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
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
                <h3 className="font-bold text-base sm:text-lg text-black mb-2 leading-snug group-hover:text-[#2D7D46] transition-colors uppercase">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
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
