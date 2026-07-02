"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const banners = [
  {
    id: 1,
    title: "PREMIUM\nPROTEIN SERIES",
    subtitle: "START FROM",
    price: "₹1999",
    cta: "Shop Now",
    link: "/products?category=Whey Protein",
    bgImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format&fit=crop",
    dark: true,
  },
  {
    id: 2,
    title: "ULTRA CLEAN\nWHEY PROTEIN",
    subtitle: "NOW AVAILABLE",
    price: "₹2499",
    cta: "Shop Now",
    link: "/products?category=Whey Protein Isolate",
    bgImage: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=1200&auto=format&fit=crop",
    dark: true,
  },
];

export default function PromoBanners() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Link
                to={banner.link}
                className="group block relative overflow-hidden rounded-2xl min-h-[320px] lg:min-h-[380px]"
              >
                {/* Background */}
                <div className="absolute inset-0">
                  <img
                    src={banner.bgImage}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col justify-between min-h-[320px] lg:min-h-[380px]">
                  <div>
                    <h3 className="heading-bold text-3xl sm:text-4xl lg:text-5xl text-white whitespace-pre-line leading-none mb-4">
                      {banner.title}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-white/60 font-medium mb-1">
                      {banner.subtitle}
                    </p>
                    <p className="text-[#8CFF64] font-black text-2xl lg:text-3xl">
                      {banner.price}
                    </p>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-black transition-all duration-300">
                      {banner.cta}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
