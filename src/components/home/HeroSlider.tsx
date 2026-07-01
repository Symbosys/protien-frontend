import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    subtitle: 'PREMIUM SPORTS NUTRITION',
    title: 'Fuel Your Ambition',
    description: 'High-quality whey, pre-workout, and vitamins to power your gains.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    cta: { text: 'Shop Bestsellers', link: '/products' },
  },
  {
    id: 2,
    subtitle: 'ENGINEERED FOR PERFORMANCE',
    title: 'Break Your Limits',
    description: 'Scientifically backed formulas for maximum strength and endurance.',
    image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=2085&auto=format&fit=crop',
    cta: { text: 'Explore Collections', link: '/products' },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
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
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <section className="relative h-[90vh] lg:h-[75vh] w-full overflow-hidden bg-white">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full w-full">
            
            {/* Left Panel: Solid Background */}
            <div className="lg:col-span-5 bg-[#0a0a0a] flex flex-col justify-center px-8 py-12 lg:px-16 text-white relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-md"
              >
                <p className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF] mb-4">
                  {slides[current].subtitle}
                </p>
                <h1 className="font-display text-3xl lg:text-5xl font-bold mb-5 leading-[1.2] text-white">
                  {slides[current].title}
                </h1>
                
                {/* Accent Border Line */}
                <div className="w-40 h-[2px] bg-[#00E5FF] my-5" />

                <p className="text-sm lg:text-base italic text-[#F9F9F9] mb-8 font-light">
                  {slides[current].description}
                </p>

                <div>
                  <Button 
                    variant="hero" 
                    size="xl" 
                    asChild 
                    className="bg-[#00E5FF] hover:bg-[#00b8cc] text-black border border-[#00E5FF] text-xs uppercase font-bold tracking-widest px-8 rounded-none transition-colors"
                  >
                    <Link to={slides[current].cta.link}>
                      {slides[current].cta.text}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right Panel: Portrait Image Showcase */}
            <div className="lg:col-span-7 relative h-[50vh] lg:h-full">
              <img
                src={slides[current].image}
                alt={slides[current].title}
                className="w-full h-full object-cover"
              />
              {/* Overlay shadow for mobile layout */}
              <div className="absolute inset-0 bg-black/10 lg:hidden" />
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-[#FAF9F6]/20 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/40 text-white lg:text-[#2C2C2C] z-20 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#FAF9F6]/20 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/40 text-white lg:text-[#2C2C2C] z-20 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-[#00E5FF]' : 'w-2.5 bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
