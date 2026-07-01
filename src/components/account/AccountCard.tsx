import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  href: string;
  badge?: string;
  variant?: 'default' | 'highlight';
  className?: string;
}

export default function AccountCard({
  icon: Icon,
  title,
  subtitle,
  href,
  badge,
  variant = 'default',
  className,
}: AccountCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={href}
        className={cn(
          "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
          "hover:shadow-md hover:border-primary/20",
          variant === 'default' && "bg-card border-border",
          variant === 'highlight' && "bg-primary/5 border-primary/10",
          className
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
            variant === 'default' && "bg-secondary group-hover:bg-primary/10",
            variant === 'highlight' && "bg-primary/10 group-hover:bg-primary/20"
          )}
        >
          <Icon className={cn(
            "h-5 w-5",
            variant === 'default' && "text-muted-foreground group-hover:text-primary",
            variant === 'highlight' && "text-primary"
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">{title}</h3>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate mt-0.5">{subtitle}</p>
          )}
        </div>
        
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </Link>
    </motion.div>
  );
}
