"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FlashSale() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Best Sellers Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl min-h-[400px] lg:min-h-[450px] flex flex-col justify-between"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1400&auto=format&fit=crop"
              alt="Best Sellers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 lg:p-12 flex-1 flex flex-col justify-center">
            <h2 className="heading-bold text-5xl sm:text-6xl lg:text-8xl text-white leading-none mb-2">
              BEST
            </h2>
            <h2 className="heading-bold text-5xl sm:text-6xl lg:text-8xl text-[#8CFF64] leading-none">
              SELLERS
            </h2>
          </div>

          {/* CTA */}
          <div className="relative z-10 p-8 lg:p-12">
            <Link
              to="/products?sort=bestselling"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#8CFF64] transition-all duration-300 shadow-lg"
            >
              Shop All Best Seller Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">
          
          {/* Card 1: Quality Promise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-black text-white p-7 rounded-2xl flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <div className="w-14 h-14 rounded-full bg-[#8CFF64] flex items-center justify-center mb-5">
                <span className="text-black font-black text-lg">✓</span>
              </div>
              <h3 className="heading-bold text-xl lg:text-2xl text-white mb-3">
                100% AUTHENTIC
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Every product is sourced directly from manufacturers. Lab tested for purity and potency. GMP certified facility.
              </p>
            </div>
            <div className="pt-4">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#8CFF64] border-b border-[#8CFF64] pb-0.5 cursor-pointer">
                View Certifications
              </span>
            </div>
          </motion.div>

          {/* Card 2: Subscribe & Save */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-[#8CFF64] text-black p-7 rounded-2xl flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-black/60 mb-2 block">Smart Savings</span>
              <h3 className="heading-bold text-2xl lg:text-3xl text-black mb-3 leading-tight">
                SUBSCRIBE &<br />SAVE 20%
              </h3>
              <p className="text-xs text-black/70 leading-relaxed font-medium">
                Get your favorite protein and pre-workout delivered monthly. Never run out of your essentials again.
              </p>
            </div>
            <div className="pt-4">
              <a href="#" className="inline-block transition-transform hover:scale-105">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-10 object-contain"
                />
              </a>
            </div>
          </motion.div>

          {/* Card 3: Gift Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-[#111] text-white p-7 rounded-2xl flex flex-col justify-between min-h-[300px] relative overflow-hidden"
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#8CFF64] mb-2 block">Gifting</span>
              <h3 className="heading-bold text-xl lg:text-2xl text-white mb-3">
                GIVE THE GIFT<br/>OF GAINS
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Perfect for every occasion. A gift card from P&N lets your gym partner pick their favorite supplements.
              </p>
            </div>

            {/* Gift Card Visual */}
            <div className="w-full h-28 border border-[#8CFF64]/30 bg-[#1A1A1A] rounded-xl p-4 flex items-center justify-between mt-4">
              <div>
                <span className="font-bold text-sm text-[#8CFF64] block">PROTEIN & NUTRIENTS</span>
                <span className="text-[8px] uppercase tracking-widest text-white/40">E-GIFT CARD</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#8CFF64] flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/gift-card"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#8CFF64] hover:text-white transition-colors"
              >
                Get Gift Card
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
