"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    subtitle: "PREMIUM SPORTS NUTRITION",
    title: "PREMIUM\nPROTEIN SERIES",
    price: "START FROM ₹1999",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    cta: { text: "Shop Now", link: "/products" },
  },
  {
    id: 2,
    subtitle: "ENGINEERED FOR PERFORMANCE",
    title: "BREAK YOUR\nLIMITS",
    price: "UP TO 40% OFF",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    cta: { text: "Explore Collections", link: "/products" },
  },
  {
    id: 3,
    subtitle: "NEW ARRIVALS",
    title: "ULTRA CLEAN\nWHEY PROTEIN",
    price: "JUST LAUNCHED",
    image:
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=2070&auto=format&fit=crop",
    cta: { text: "Shop Now", link: "/products" },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-9">
      <div
        className="relative w-full overflow-hidden bg-black rounded-3xl"
        style={{ height: "clamp(420px, 75vh, 700px)" }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={slides[current].image}
                alt={slides[current].title}
                className="w-full h-full object-cover object-top opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center pt-8 lg:pt-12">
              <div className="w-full px-6 sm:px-12 lg:px-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="max-w-lg"
                >
                  <span className="text-white/70 font-semibold text-xs sm:text-sm tracking-widest uppercase mb-2 block">
                    {slides[current].subtitle}
                  </span>

                  <h1 className="heading-bold text-4xl sm:text-5xl lg:text-7xl text-white mb-4 whitespace-pre-line leading-[1.1]">
                    {slides[current].title}
                  </h1>

                  <p className="text-[#8CFF64] font-bold text-lg sm:text-xl lg:text-2xl mb-6 tracking-wide">
                    {slides[current].price}
                  </p>

                  <Link
                    to={slides[current].cta.link}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300"
                  >
                    {slides[current].cta.text}
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/30 text-white z-20 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/30 text-white z-20 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === current ? "w-8 bg-[#8CFF64]" : "w-2.5 bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
