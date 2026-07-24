import { motion } from 'framer-motion';
import { User, Edit2, Crown, LogOut, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';

interface AccountHeaderProps {
  onLogout?: () => void;
  onEditProfile?: () => void;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    createdAt?: string;
  } | null;
}

export default function AccountHeader({ onLogout, onEditProfile, user }: AccountHeaderProps) {
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length || 0;

  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Guest User';
  const email = user?.email || 'No email provided';
  const phoneNumber = user?.phoneNumber || '';

  const memberSince = user?.createdAt 
    ? `Member since ${new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'Member';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />
      </div>
      
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground" />
              </div>
              <button 
                onClick={onEditProfile}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border-2 border-background flex items-center justify-center shadow-md hover:bg-secondary transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="sm:hidden">
              <h2 className="text-xl font-display font-semibold text-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <div className="hidden sm:block mb-3">
              <h2 className="text-2xl font-display font-semibold text-foreground">{name}</h2>
              <p className="text-muted-foreground">{email}{phoneNumber ? ` • ${phoneNumber}` : ''}</p>
            </div>
            
            {/* Membership Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20">
                <Crown className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Premium Member</span>
              </div>
              <span className="text-sm text-muted-foreground">{memberSince}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditProfile}
              className="flex-1 sm:flex-none"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/50">
          {[
            { label: 'Total Orders', value: '24' },
            { label: 'Wishlist Items', value: wishlistCount.toString() },
          ].map((stat, i) => (
            <div key={i} className="text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-display font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
