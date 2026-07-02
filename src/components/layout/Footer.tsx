import { Facebook, Instagram, MapPin, MessageCircle, Phone, Store, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display text-xl lg:text-2xl font-black tracking-wider text-[#8CFF64] group-hover:text-white transition-colors uppercase">
                PROTEIN & NUTRIENTS
              </span>
            </Link>

            <div className="space-y-4 text-xs lg:text-sm text-white/60 leading-relaxed">
              {/* Address 1 */}
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-[#8CFF64] flex-shrink-0 mt-0.5" />
                <span>
                  NH 87, Mangal Parao, Banbhoolpura, Haldwani<br />
                  Uttarakhand 263139
                </span>
              </div>

              {/* Address 2 */}
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-[#8CFF64] flex-shrink-0 mt-0.5" />
                <span>
                  LGF-110, OC Square, Commercial Complex, Orange County, Ahinsa Khand 1, Indirapuram, Ghaziabad,<br />
                  Uttar Pradesh 201014
                </span>
              </div>

              {/* Phone / Contact */}
              <div className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-[#8CFF64] flex-shrink-0" />
                <div>
                  <span className="block font-semibold text-white text-xs">Contact Us</span>
                  <a href="tel:9548300211" className="hover:text-[#8CFF64] font-bold">9548300211</a>
                </div>
              </div>

              {/* Store Locator Link */}
              <div className="flex items-center gap-2.5 pt-2">
                <Store className="h-5 w-5 text-[#8CFF64] flex-shrink-0" />
                <Link to="/stores" className="hover:text-[#8CFF64] font-semibold text-white underline">
                  Store Locator
                </Link>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3 pt-2">
              <a href="https://wa.me/919548300211" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform" aria-label="WhatsApp">
                <MessageCircle className="h-5 w-5 fill-current" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#1877F2] hover:scale-110 transition-all" aria-label="Facebook">
                <Facebook className="h-5 w-5 fill-current" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:scale-110 transition-all" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#FF0000] hover:scale-110 transition-all" aria-label="YouTube">
                <Youtube className="h-5 w-5 fill-current" />
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="space-y-6">
            <h4 className="font-display text-base font-bold text-[#8CFF64] border-b border-white/10 pb-2 uppercase">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs lg:text-sm text-white/60 font-medium">
              {['Whey Protein', 'Creatine', 'Pre Workout', 'BCAA', 'Multivitamins', 'Fish Oil', 'Peanut Butter', 'L-Carnitine'].map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="hover:text-[#8CFF64] transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display text-base font-bold text-[#8CFF64] border-b border-white/10 pb-2 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs lg:text-sm text-white/60 font-medium">
              <li>
                <Link to="/about" className="hover:text-[#8CFF64] transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#8CFF64] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/return-refund" className="hover:text-[#8CFF64] transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-[#8CFF64] transition-colors">Customer Reviews</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-[#8CFF64] transition-colors">Customer Support</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: App Download */}
          <div className="space-y-6">
            <h4 className="font-display text-base font-bold text-[#8CFF64] border-b border-white/10 pb-2 uppercase">
              Download Our App
            </h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Fitness App, Made To Track Your Macros & Gains!
            </p>
            
            {/* Store Badges */}
            <div className="flex flex-col gap-3">
              <a href="#" className="inline-block transition-transform hover:scale-105">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-10 object-contain"
                />
              </a>
              <a href="#" className="inline-block transition-transform hover:scale-105">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on the App Store" 
                  className="h-10 object-contain"
                />
              </a>
            </div>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} PROTEIN AND NUTRIENTS. All rights reserved.</p>
          <p className="mt-2 font-semibold tracking-wide text-white/60 flex items-center justify-center gap-1.5">
            Powered By <span className="text-[#8CFF64] font-bold tracking-widest text-[10px] uppercase">symbosys</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
