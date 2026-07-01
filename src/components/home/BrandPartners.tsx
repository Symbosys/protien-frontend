import { motion } from 'framer-motion';
import { Instagram, ArrowLeft, ArrowRight } from 'lucide-react';

const instagramCards = [
  {
    id: 1,
    type: 'logo',
    title: '@protein_nutrients',
    bg: 'bg-[#1A1A1A]',
  },
  {
    id: 2,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800',
    title: 'Premium Whey Protein',
  },
  {
    id: 3,
    type: 'coming-soon',
    title: 'NEW ARRIVALS',
    description: "The hardest hitting pre-workout is dropping next week. Prepare to break your PRs and push past your limits.",
    bg: 'bg-primary',
  },
  {
    id: 4,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800',
    title: 'Essential Amino Acids',
  },
];

export default function BrandPartners() {
  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-[#E5D5B5]/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Section Header with Dividers */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-border w-16 lg:w-36 relative flex items-center justify-end">
            <div className="w-2 h-2 bg-primary rounded-full border border-white absolute" />
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#2C2C2C] text-center tracking-wide whitespace-nowrap uppercase">
            Join the community
          </h2>
          <div className="h-px bg-border w-16 lg:w-36 relative flex items-center justify-start">
            <div className="w-2 h-2 bg-primary rounded-full border border-white absolute" />
          </div>
        </div>

        {/* Carousel / Grid Wrapper */}
        <div className="relative">
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instagramCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="relative aspect-square overflow-hidden border border-[#E5D5B5]/60 rounded group hover:shadow-medium transition-shadow flex flex-col justify-between"
              >
                {/* 1. Logo Card */}
                {card.type === 'logo' && (
                  <div className={`w-full h-full ${card.bg} flex flex-col items-center justify-center p-6 text-white text-center`}>
                    <Instagram className="h-10 w-10 text-primary mb-3 stroke-[1.5]" />
                    <span className="text-xs uppercase font-bold tracking-widest text-primary mb-1">Follow Us</span>
                    <span className="font-display text-lg font-semibold tracking-wide text-white">{card.title}</span>
                  </div>
                )}

                {/* 2. Image Card */}
                {card.type === 'image' && (
                  <div className="w-full h-full relative">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover Link Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-black bg-primary p-3 rounded-full hover:scale-110 transition-transform"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* 3. Coming Soon Text Card */}
                {card.type === 'coming-soon' && (
                  <div className={`w-full h-full ${card.bg} flex flex-col justify-center p-6 lg:p-8 text-black text-center`}>
                    <Instagram className="h-6 w-6 text-black mx-auto mb-2" />
                    <h3 className="font-display text-lg font-extrabold text-black tracking-wider mb-3">
                      {card.title}
                    </h3>
                    <p className="text-[10px] lg:text-xs text-[#111] leading-relaxed font-semibold">
                      {card.description}
                    </p>
                  </div>
                )}

              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
