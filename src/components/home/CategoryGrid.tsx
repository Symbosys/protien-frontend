import { useCategoriesQuery } from '@/api/hooks/category.hooks';
import { categories as mockCategories } from '@/data/products';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoryGrid() {
  const { data } = useCategoriesQuery({ limit: 10 });

  const processImageUrl = (url: string | null) => {
    if (!url) return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
      : "http://localhost:4000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const categoriesList = data?.categories && data.categories.length > 0
    ? data.categories.map(cat => ({
        name: cat.name,
        image: processImageUrl(cat.image),
      }))
    : mockCategories;

  // We'll use our category mock/dynamic data, taking first 5 for the category grid cards
  const activeCategories = categoriesList.slice(0, 5);

  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-[#E5D5B5]/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Section 1: Fitness Branding */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#2C2C2C] mb-4 uppercase">
            Power Your Performance
          </h2>
          <p className="text-sm text-[#555] leading-relaxed mb-10 font-medium">
            Our premium supplements are scientifically formulated to help you build muscle, increase endurance, and crush your goals.
          </p>

          {/* Trust Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            
            {/* Badge 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-3 bg-white">
                <Award className="h-8 w-8 text-primary stroke-[1.5]" />
              </div>
              <span className="font-display text-sm font-bold text-[#2C2C2C] uppercase">100% Authentic</span>
            </div>

            {/* Badge 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-3 bg-white">
                <ShieldCheck className="h-8 w-8 text-primary stroke-[1.5]" />
              </div>
              <span className="font-display text-sm font-bold text-[#2C2C2C] uppercase">Lab Tested</span>
            </div>

            {/* Badge 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-3 bg-white">
                <Sparkles className="h-8 w-8 text-primary stroke-[1.5]" />
              </div>
              <span className="font-display text-sm font-bold text-[#2C2C2C] uppercase">Premium Ingredients</span>
            </div>

          </div>

          {/* Shop Bestsellers Button */}
          <div>
            <Link
              to="/products"
              className="inline-block bg-[#1A1A1A] hover:bg-primary text-white text-xs font-semibold uppercase tracking-widest py-3 px-8 rounded transition-colors"
            >
              Shop bestsellers
            </Link>
          </div>
        </div>

        {/* Section 2: Shop By Category */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px bg-border w-24 lg:w-48 relative flex items-center justify-end">
              <div className="w-2.5 h-2.5 bg-primary rounded-full border border-white absolute" />
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#2C2C2C] text-center tracking-wide uppercase whitespace-nowrap">
              Shop by category
            </h2>
            <div className="h-px bg-border w-24 lg:w-48 relative flex items-center justify-start">
              <div className="w-2.5 h-2.5 bg-primary rounded-full border border-white absolute" />
            </div>
          </div>

          {/* Category Cards Carousel/Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {activeCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="group relative h-[250px] lg:h-[320px] overflow-hidden bg-white border border-[#E5D5B5]/60 hover:shadow-medium transition-shadow rounded"
              >
                <Link to={`/products?category=${category.name}`} className="block w-full h-full relative">
                  {/* Category Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Bottom Text */}
                  <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                    <h3 className="font-display text-lg lg:text-xl text-white font-bold tracking-wide group-hover:text-primary transition-colors mb-1 uppercase">
                      {category.name}
                    </h3>
                    <span className="text-[9px] uppercase tracking-widest text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                      View items
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
