import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Alex Smith",
    text: "One of the most reliable supplement stores online. The best part is the quality of their whey protein—mixes perfectly every time.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    text: "Thank you P&N for the fast shipping. The pre-workout has given me exactly the boost I needed for my heavy lift days.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
    rating: 5,
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    text: "Best and right place for authentic supplements at the best price. A completely convincing experience from product range to support.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120",
    rating: 5,
  },
  {
    id: 4,
    name: "Emily Chen",
    text: "I've always been particular about my BCAAs and this is my place to be. The flavor profiles are incredible.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? reviews.length - 2 : prev - 2));
  };

  const next = () => {
    setCurrent((prev) => (prev >= reviews.length - 2 ? 0 : prev + 2));
  };

  // We display 2 cards on desktop, 1 on mobile
  const visibleReviews = [
    reviews[current],
    reviews[(current + 1) % reviews.length]
  ];

  return (
    <section className="py-16 bg-white border-b border-[#E5D5B5]/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header with dot-lines */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <div className="h-px bg-border w-16 lg:w-36 relative flex items-center justify-end">
            <div className="w-2 h-2 bg-primary rounded-full border border-white absolute" />
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#2C2C2C] text-center tracking-wide whitespace-nowrap uppercase">
            Athlete Reviews
          </h2>
          <div className="h-px bg-border w-16 lg:w-36 relative flex items-center justify-start">
            <div className="w-2 h-2 bg-primary rounded-full border border-white absolute" />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto flex items-center gap-4 lg:gap-8">
          
          {/* Left Navigation */}
          <button
            onClick={prev}
            className="p-3 bg-white border border-[#E5D5B5] hover:border-[#8A1B28] hover:text-[#8A1B28] rounded-full shadow-sm text-[#555] transition-colors"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2]" />
          </button>

          {/* Review Cards Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            {visibleReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-border rounded-xl p-6 relative shadow-sm flex flex-col justify-between min-h-[190px]"
              >
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#111] text-primary text-[11px] font-bold tracking-wider px-4 py-1.5 rounded-full uppercase shadow-sm border border-primary/20">
                    {review.name}
                  </div>
                  
                  {/* Floating Avatar */}
                  <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden bg-white shadow-sm flex-shrink-0 -mt-10 mr-2">
                    <img 
                      src={review.avatar} 
                      alt={review.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Review Text with Left Border Indicator */}
                <div className="border-l-2 border-primary pl-3 italic text-xs lg:text-sm text-[#555] leading-relaxed flex-1 font-medium">
                  "{review.text}"
                </div>
              </div>
            ))}
          </div>

          {/* Right Navigation */}
          <button
            onClick={next}
            className="p-3 bg-white border border-[#E5D5B5] hover:border-[#8A1B28] hover:text-[#8A1B28] rounded-full shadow-sm text-[#555] transition-colors"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-5 w-5 stroke-[2]" />
          </button>

        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(Math.ceil(reviews.length / 2))].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index * 2)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index * 2 === current ? 'w-6 bg-[#8A1B28]' : 'w-2 bg-[#E5D5B5]'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
