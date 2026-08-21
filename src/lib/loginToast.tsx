import Link from "next/link";
import { toast } from "sonner";
import { LogIn, ArrowRight } from "lucide-react";

/**
 * Custom professional & industry standard toast that appears when an unauthenticated
 * user tries to add a product to their cart.
 * 
 * Uses Next.js <Link> so clicking anywhere on the toast navigates client-side
 * to /login with zero page reload.
 * 
 * Uses `unstyled: true` so Sonner removes its default outer container styles,
 * eliminating any double-border/overlay clipping and ensuring perfect border radius.
 */
export const showLoginRequiredToast = (
  message: string = "Please log in to add items to the cart",
) => {
  // Dismiss previous login-required toast if already active to prevent duplicates
  toast.dismiss("login-required-toast");

  toast.custom(
    (t) => (
      <Link
        href="/login"
        onClick={() => toast.dismiss(t)}
        className="w-full sm:w-[420px] max-w-[92vw] bg-black text-white border border-primary/40 hover:border-primary rounded-2xl p-3 sm:p-3.5 shadow-2xl shadow-black/80 transition-all duration-200 cursor-pointer flex items-center gap-3 group relative select-none pointer-events-auto overflow-hidden"
      >
        {/* Left Icon with glow and rounded radius */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-primary/25 transition-transform duration-200">
          <LogIn className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </div>

        {/* Toast Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-xs sm:text-sm text-white tracking-tight">
              Login Required
            </span>
            <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/30">
              Sign In
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-300 leading-snug truncate">
            {message}
          </p>
        </div>

        {/* Right CTA Button */}
        <div className="flex items-center flex-shrink-0 pl-1">
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md group-hover:bg-primary/90 group-hover:shadow-primary/30 transition-all duration-200">
            <span>Log In</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
          </div>
        </div>
      </Link>
    ),
    {
      id: "login-required-toast",
      duration: 5000,
      position: "top-center",
      unstyled: true,
    },
  );
};
