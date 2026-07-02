"use client";

import { useCategoriesQuery } from '@/api/hooks/category.hooks';
import { categories as mockCategories } from '@/data/products';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function CategoryGrid() {
  const { data } = useCategoriesQuery({ limit: 50 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const categoriesList = data?.categories && data.categories.length > 0
    ? data.categories.map(cat => ({ name: cat.name }))
    : mockCategories;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="heading-bold text-2xl sm:text-3xl lg:text-4xl text-black">
            SHOP BY <span className="text-[#8CFF64]">CATEGORY</span>
          </h2>
          <Link
            to="/categories"
            className="hidden sm:inline-flex items-center gap-1 text-xs uppercase font-bold tracking-wider text-black hover:text-[#5BBF3D] transition-colors"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Scrollable Category Pills */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-4"
        >
          {categoriesList.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
            >
              <Link
                to={`/products?category=${category.name}`}
                className="pill-green whitespace-nowrap text-xs sm:text-sm"
              >
                {category.name}
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
