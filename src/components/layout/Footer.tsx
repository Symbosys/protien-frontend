import {
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Store,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCategoriesQuery } from "@/api/hooks/category.hooks";

export default function Footer() {
  const { data: categoriesData } = useCategoriesQuery({ page: 1, limit: 6 });
  const categories = categoriesData?.categories?.slice(0, 6) ?? [];

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Footer Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-10 border-b border-white/10 mb-12">
          {/* Logo */}
          <div className="w-[82px] h-[82px] bg-white flex items-center justify-center p-2 rounded-md">
            <img
              src="/logo.jpg"
              alt="Protein & Nutrients Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Email Support */}
          <div className="flex items-center gap-2.5">
            <div className="text-[#8CFF64]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-none stroke-current stroke-2"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <a
              href="mailto:akkigupta2411@gmail.com"
              className="text-white hover:text-[#8CFF64] transition-colors text-sm lg:text-base font-semibold"
            >
              support@protein-and-nutrients.com
            </a>
          </div>

          {/* Live Chat */}
          <div className="flex items-center gap-2.5">
            <div className="text-[#8CFF64]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-none stroke-current stroke-2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <a
              href="https://wa.me/916200065378"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#8CFF64] transition-colors text-sm lg:text-base font-semibold uppercase"
            >
              live chat
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5 text-white/40">
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-none stroke-current stroke-2"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

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
                <span>Ratu road ranchi-5</span>
              </div>

              {/* Phone / Contact */}
              <div className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-[#8CFF64] flex-shrink-0" />
                <div>
                  <span className="block font-semibold text-white text-xs">
                    Contact Us
                  </span>
                  <a
                    href="tel:6200065378"
                    className="hover:text-[#8CFF64] font-bold"
                  >
                    7759-957841
                  </a>
                </div>
              </div>

              {/* Store Locator Link */}
              <div className="flex items-center gap-2.5 pt-2">
                <Store className="h-5 w-5 text-[#8CFF64] flex-shrink-0" />
                <Link
                  to="/stores"
                  className="hover:text-[#8CFF64] font-semibold text-white underline"
                >
                  Store Locator
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Categories — dynamic, max 6 */}
          <div className="space-y-6">
            <h4 className="font-display text-base font-bold text-[#8CFF64] border-b border-white/10 pb-2 uppercase">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs lg:text-sm text-white/60 font-medium">
              {categories.length > 0
                ? categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="hover:text-[#8CFF64] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                : /* Skeleton placeholders while loading */
                  Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="h-4 w-28 bg-white/10 rounded animate-pulse" />
                  ))}
            </ul>
          </div>


          {/* Column 3: Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display text-base font-bold text-[#8CFF64] border-b border-white/10 pb-2 uppercase">
              POLICIES
            </h4>
            <ul className="space-y-2.5 text-xs lg:text-sm text-white/60 font-medium">
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#8CFF64] transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-[#8CFF64] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="hover:text-[#8CFF64] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-delivery"
                  className="hover:text-[#8CFF64] transition-colors"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  to="/exchange-policy"
                  className="hover:text-[#8CFF64] transition-colors"
                >
                  Exchange Policy
                </Link>
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
              <a
                href="#"
                className="inline-block transition-transform hover:scale-105"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-10 object-contain"
                />
              </a>
              <a
                href="#"
                className="inline-block transition-transform hover:scale-105"
              >
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
          <p>
            © {new Date().getFullYear()} PROTEIN AND NUTRIENTS. All rights
            reserved.
          </p>
          <p className="mt-2 font-semibold tracking-wide text-white/60 flex items-center justify-center gap-1.5">
            Powered By{" "}
            <span className="text-[#8CFF64] font-bold tracking-widest text-[10px] uppercase">
              symbosys
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
