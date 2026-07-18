"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useReviewsQuery, ReviewItem } from "@/api/hooks/review.hooks";

interface TestimonialItem {
  id: string;
  name: string;
  title: string;
  text: string;
  rating: number;
  date: string;
  product: string;
}

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading } = useReviewsQuery({ limit: 10 });

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  if (isLoading) {
    return null;
  }

  const rawReviews = data?.reviews || [];

  if (rawReviews.length === 0) {
    return null;
  }

  const activeReviews: TestimonialItem[] = rawReviews.map((r: ReviewItem) => ({
    id: r.id,
    name: r.customerName && r.customerName.toLowerCase() !== "anonymous" ? r.customerName : "Verified Buyer",
    title: r.rating === 5 ? "Highly Recommended!" : "Great Quality Product",
    text: r.comment,
    rating: r.rating,
    date: formatDate(r.date),
    product: r.productName,
  }));


  return (
    <section className="py-14 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2
              className="heading-bold text-3xl sm:text-4xl lg:text-5xl text-gray-300 italic"
              style={{ fontStyle: "italic" }}
            >
              FEATURED
            </h2>
            <h2 className="heading-bold text-3xl sm:text-4xl lg:text-5xl text-black">
              REVIEWS
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-[#8CFF64] flex items-center justify-center text-gray-400 hover:text-black transition-colors"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-[#8CFF64] flex items-center justify-center text-gray-400 hover:text-black transition-colors"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Review Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto hide-scrollbar pb-4"
        >
          {activeReviews.map((review: TestimonialItem, index: number) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="min-w-[300px] sm:min-w-[340px] max-w-[380px] flex-shrink-0 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              {/* Stars & Date */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-orange-400 text-orange-400"
                    />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star
                      key={`empty-${i}`}
                      className="w-4 h-4 fill-gray-200 text-gray-200"
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {review.date}
                </span>
              </div>

              {/* Review Title */}
              <h4 className="font-bold text-base text-black mb-2">
                {review.title}
              </h4>

              {/* Review Text */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                {review.text}
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#8CFF64] flex items-center justify-center text-black font-bold text-xs">
                    {review.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {review.name}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                  {review.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
