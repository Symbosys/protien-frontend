import { Facebook, Instagram, MapPin, MessageCircle, Phone, Store, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white text-[#2C2C2C] border-t border-[#E5D5B5]/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display text-xl lg:text-2xl font-bold tracking-wider text-primary group-hover:text-accent transition-colors">
                PROTEIN & NUTRIENTS
              </span>
            </Link>

            <div className="space-y-4 text-xs lg:text-sm text-[#555] leading-relaxed">
              {/* Address 1 */}
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-[#8A1B28] flex-shrink-0 mt-0.5" />
                <span>
                  NH 87, Mangal Parao, Banbhoolpura, Haldwani<br />
                  Uttarakhand 263139
                </span>
              </div>

              {/* Address 2 */}
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-[#8A1B28] flex-shrink-0 mt-0.5" />
                <span>
                  LGF-110, OC Square, Commercial Complex, Orange County, Ahinsa Khand 1, Indirapuram, Ghaziabad,<br />
                  Uttar Pradesh 201014
                </span>
              </div>

              {/* Phone / Contact */}
              <div className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-[#8A1B28] flex-shrink-0" />
                <div>
                  <span className="block font-semibold text-[#2C2C2C] text-xs">Contact Us</span>
                  <a href="tel:9548300211" className="hover:text-[#8A1B28] font-bold">9548300211</a>
                </div>
              </div>

              {/* Store Locator Link */}
              <div className="flex items-center gap-2.5 pt-2">
                <Store className="h-5 w-5 text-[#8A1B28] flex-shrink-0" />
                <Link to="/stores" className="hover:text-[#8A1B28] font-semibold text-[#2C2C2C] underline">
                  Store Locator
                </Link>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3 pt-2">
              <a href="https://wa.me/919548300211" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-105 transition-transform" aria-label="WhatsApp">
                <MessageCircle className="h-5 w-5 fill-current" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-105 transition-transform" aria-label="Facebook">
                <Facebook className="h-5 w-5 fill-current" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:scale-105 transition-transform" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-105 transition-transform" aria-label="YouTube">
                <Youtube className="h-5 w-5 fill-current" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6 md:pl-10">
            <h4 className="font-display text-base font-bold text-[#8A1B28] border-b border-[#E5D5B5] pb-2">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-xs lg:text-sm text-[#555] uppercase tracking-wider font-semibold">
              <li>
                <Link to="/privacy" className="hover:text-[#8A1B28] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/return-refund" className="hover:text-[#8A1B28] transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">Our Story</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: App Download & QR Code */}
          <div className="space-y-6">
            <h4 className="font-display text-base font-bold text-[#8A1B28] border-b border-[#E5D5B5] pb-2">
              Download Our App
            </h4>
            <p className="text-xs text-[#555] leading-relaxed">
              Fitness App, Made To Track Your Macros & Gains!
            </p>
            
            {/* Store Badges */}
            <div className="flex flex-col sm:flex-row gap-3">
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

            {/* Custom stylized QR Code SVG */}
            <div className="pt-2">
              <div className="inline-block p-2 bg-white border border-[#E5D5B5] rounded shadow-sm">
                <svg width="100" height="100" viewBox="0 0 100 100" className="text-[#2C2C2C] fill-current">
                  {/* Corner Position Detection Blocks */}
                  <rect x="0" y="0" width="24" height="24" />
                  <rect x="3" y="3" width="18" height="18" fill="white" />
                  <rect x="6" y="6" width="12" height="12" />

                  <rect x="76" y="0" width="24" height="24" />
                  <rect x="79" y="3" width="18" height="18" fill="white" />
                  <rect x="82" y="6" width="12" height="12" />

                  <rect x="0" y="76" width="24" height="24" />
                  <rect x="3" y="79" width="18" height="18" fill="white" />
                  <rect x="6" y="82" width="12" height="12" />

                  {/* Smaller alignment module */}
                  <rect x="70" y="70" width="10" height="10" />
                  <rect x="72" y="72" width="6" height="6" fill="white" />
                  <rect x="74" y="74" width="2" height="2" />

                  {/* Fake QR Data Dots Grid */}
                  <rect x="30" y="2" width="4" height="4" />
                  <rect x="38" y="0" width="8" height="4" />
                  <rect x="50" y="4" width="4" height="8" />
                  <rect x="60" y="2" width="8" height="4" />
                  <rect x="30" y="12" width="12" height="4" />
                  <rect x="46" y="16" width="6" height="4" />
                  <rect x="58" y="12" width="4" height="10" />
                  <rect x="66" y="16" width="8" height="4" />

                  <rect x="30" y="30" width="4" height="4" />
                  <rect x="2" y="30" width="8" height="4" />
                  <rect x="14" y="34" width="4" height="8" />
                  <rect x="38" y="30" width="12" height="4" />
                  <rect x="54" y="34" width="8" height="8" />
                  <rect x="66" y="30" width="4" height="4" />
                  <rect x="76" y="32" width="12" height="4" />
                  <rect x="92" y="30" width="6" height="4" />

                  <rect x="2" y="46" width="6" height="4" />
                  <rect x="12" y="48" width="8" height="8" />
                  <rect x="24" y="44" width="4" height="4" />
                  <rect x="34" y="48" width="14" height="4" />
                  <rect x="52" y="44" width="4" height="12" />
                  <rect x="62" y="48" width="8" height="4" />
                  <rect x="74" y="44" width="12" height="4" />
                  <rect x="90" y="48" width="8" height="4" />

                  <rect x="30" y="58" width="4" height="12" />
                  <rect x="38" y="62" width="8" height="4" />
                  <rect x="50" y="58" width="12" height="4" />
                  <rect x="66" y="62" width="4" height="8" />
                  <rect x="76" y="58" width="6" height="4" />
                  <rect x="86" y="60" width="10" height="4" />

                  <rect x="34" y="76" width="4" height="4" />
                  <rect x="42" y="74" width="12" height="4" />
                  <rect x="58" y="78" width="4" height="12" />
                  <rect x="90" y="76" width="8" height="4" />
                  <rect x="30" y="86" width="12" height="4" />
                  <rect x="46" y="84" width="8" height="8" />
                  <rect x="84" y="86" width="12" height="4" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="border-t border-[#E5D5B5]/60 mt-12 pt-6 text-center text-xs text-[#888]">
          <p>© {new Date().getFullYear()} PROTEIN AND NUTRIENTS. All rights reserved.</p>
          <p className="mt-2 font-semibold tracking-wide text-[#2C2C2C] flex items-center justify-center gap-1.5">
            Powered By <span className="text-primary font-bold tracking-widest text-[10px] uppercase">symbosys</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
