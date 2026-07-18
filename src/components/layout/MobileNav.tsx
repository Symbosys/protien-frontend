import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Grid3X3, Home, Search, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Shop', path: '/' },
  { icon: Grid3X3, label: 'Categories', path: '/categories' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: ShoppingBag, label: 'Cart', path: '/cart' },
  { icon: User, label: 'Account', path: '/account' },
];

export default function MobileNav() {
  const location = useLocation();
  const { itemCount, openCart } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isCart = item.label === 'Cart';

          const content = (
            <div className="relative flex flex-col items-center py-2 px-4">
              <div className="relative">
                <item.icon className={cn(
                  "h-6 w-6 transition-colors",
                  isActive ? "text-[#5BBF3D]" : "text-gray-400"
                )} />
                {isCart && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#8CFF64] text-black text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] mt-1 transition-colors font-semibold uppercase tracking-wide",
                isActive ? "text-[#5BBF3D]" : "text-gray-400"
              )}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8CFF64]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </div>
          );

          if (isCart) {
            return (
              <button key={item.label} onClick={openCart} className="relative">
                {content}
              </button>
            );
          }

          return (
            <Link key={item.label} to={item.path} className="relative">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
