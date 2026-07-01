import { Link } from "react-router-dom";
import { CheckCircle, Smartphone, Heart, ArrowRight } from "lucide-react";

export default function FlashSale() {
  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-[#E5D5B5]/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Promos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Banner 1: Quality Stamps */}
          <div className="bg-[#1A1A1A] text-white p-8 rounded-lg flex flex-col justify-between shadow-sm min-h-[360px]">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">Certified Quality</p>
              <h3 className="font-display text-xl lg:text-2xl font-bold uppercase tracking-wide mb-8">
                Lab Tested Supplements
              </h3>

              {/* Three stamps explanation list */}
              <div className="space-y-6">
                
                {/* Stamp 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 font-bold text-[10px] bg-[#1A1A1A] text-primary">
                    GMP
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wide">GMP Certified</h4>
                    <p className="text-[10px] text-[#FFF]/80 font-light">Highest manufacturing standards</p>
                  </div>
                </div>

                {/* Stamp 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 font-bold text-[10px] bg-[#1A1A1A] text-primary">
                    100%
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wide">100% Authentic</h4>
                    <p className="text-[10px] text-[#FFF]/80 font-light">Sourced directly from manufacturers</p>
                  </div>
                </div>

                {/* Stamp 3 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 font-bold text-[10px] bg-[#1A1A1A] text-primary">
                    P&N
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wide">P&N Quality Seal</h4>
                    <p className="text-[10px] text-[#FFF]/80 font-light">Tested for purity and potency</p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="pt-6">
              <span className="text-[10px] uppercase tracking-widest font-bold border-b border-primary text-primary pb-0.5 cursor-pointer">
                View Lab Reports
              </span>
            </div>
          </div>

          {/* Banner 2: Digital Subscription */}
          <div className="bg-primary text-black p-8 rounded-lg flex flex-col lg:flex-row gap-6 justify-between shadow-sm min-h-[360px]">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#111] mb-2 font-bold">Smart Savings</p>
                <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-black mb-4 leading-snug">
                  Subscribe & Save, <br />
                  <span className="text-[#111]">Never Run Out</span>
                </h3>
                <p className="text-xs text-black/80 leading-relaxed mb-6 font-semibold">
                  Get your favorite protein and pre-workout delivered monthly. Save up to 20% on subscriptions.
                </p>
              </div>

              <div>
                <a href="#" className="inline-block transition-transform hover:scale-105">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                    alt="Get it on Google Play" 
                    className="h-10 object-contain"
                  />
                </a>
              </div>
            </div>

            {/* Smartphone & Protein Representation */}
            <div className="w-24 lg:w-32 flex items-center justify-center self-center flex-shrink-0">
              <svg viewBox="0 0 100 160" className="w-full h-auto text-black">
                {/* Phone Body */}
                <rect x="10" y="10" width="80" height="140" rx="10" fill="#1A1A1A" stroke="#111" strokeWidth="3" />
                {/* Screen */}
                <rect x="14" y="18" width="72" height="114" rx="4" fill="#00E5FF" />
                {/* Padlock Icon */}
                <circle cx="50" cy="65" r="12" fill="#111" />
                <rect x="42" y="65" width="16" height="16" rx="2" fill="#111" />
                <path d="M45,65 L45,58 C45,54 55,54 55,58 L55,65" fill="none" stroke="#111" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Banner 3: Gift Card Promo */}
          <div className="bg-[#111] text-white p-8 rounded-lg flex flex-col justify-between shadow-sm min-h-[360px] relative overflow-hidden">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">Gifting</p>
              <h3 className="font-display text-xl lg:text-2xl font-bold uppercase tracking-wide text-white mb-4">
                Give the Gift of Gains
              </h3>
              <p className="text-xs text-[#FFF]/80 leading-relaxed mb-6 font-light">
                Perfect for every occasion, a gift card from P&N lets your gym partner pick their favorite supplements.
              </p>
            </div>

            {/* Gift Card envelope styling representation */}
            <div className="w-full h-36 border border-primary/40 bg-[#1A1A1A] rounded-md p-4 flex items-center justify-between shadow-inner relative">
              <div className="space-y-1">
                <span className="font-display font-bold text-sm text-primary">PROTEIN & NUTRIENTS</span>
                <span className="block text-[8px] uppercase tracking-widest text-[#FFF]/60">E-GIFT CARD</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary border border-primary flex items-center justify-center">
                <Heart className="h-6 w-6 text-black fill-current" />
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/gift-card"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary hover:text-[#FFF] transition-colors"
              >
                Get Your Gift Card
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
