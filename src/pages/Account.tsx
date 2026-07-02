import { motion } from 'framer-motion';
import {
  Package, Truck, RotateCcw, CreditCard, Wallet,
  User, MapPin, FileText, Lock,
  Heart, Bookmark, Store, Clock,
  Gift, Ticket, HelpCircle, MessageCircle,
  ChevronRight
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import AccountHeader from '@/components/account/AccountHeader';
import AccountCard from '@/components/account/AccountCard';
import OrdersPreview from '@/components/account/OrdersPreview';
import AddressPreview from '@/components/account/AddressPreview';
// import SecuritySettings from '@/components/account/SecuritySettings';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useUserQuery } from '@/api/hooks/user.hooks';
import { useLogoutMutation } from '@/api/hooks/auth.hooks';

const accountSections = [
  {
    title: 'Orders & Payments',
    items: [
      { icon: Package, title: 'My Orders', subtitle: 'View & track orders', href: '/MyntraOrderPage' },
      { icon: Truck, title: 'Track Orders', subtitle: 'Real-time tracking', href: '/track-order' },
      { icon: RotateCcw, title: 'Returns & Refunds', subtitle: 'Manage returns', href: '/return-refund' },
      { icon: CreditCard, title: 'Saved Cards', subtitle: 'Manage payment methods', href: '/account/cards' },
      { icon: Wallet, title: 'UPI & Wallets', subtitle: 'Link payment options', href: '/account/wallets' },
    ],
  },
  {
    title: 'Account Settings',
    items: [
      { icon: User, title: 'Personal Information', subtitle: 'Name, email, phone', href: '/account/personal-information' },
      { icon: MapPin, title: 'Saved Addresses', subtitle: 'Manage delivery addresses', href: '/account/addresses' },
      // { icon: FileText, title: 'PAN & Legal Info', subtitle: 'Tax & legal documents', href: '/account/legal' },
      { icon: Lock, title: 'Login & Security', subtitle: 'Password & 2FA', href: '/account/security' },
    ],
  },
  {
    title: 'My Stuff',
    items: [
      { icon: Heart, title: 'Wishlist', subtitle: 'Items you love', href: '/wishlist', badge: '12' },
      { icon: Bookmark, title: 'Saved Items', subtitle: 'Bookmarked for later', href: '/account/saved' },
      // { icon: Store, title: 'Followed Stores', subtitle: 'Favorite brands', href: '/account/stores' },
      { icon: Clock, title: 'Recently Viewed', subtitle: 'Browsing history', href: '/account/history' },
    ],
  },
  {
    title: 'Rewards & Support',
    items: [
      { icon: Gift, title: 'Reward Points', subtitle: '2,450 points available', href: '/account/rewards', variant: 'highlight' as const },
      { icon: Ticket, title: 'Coupons', subtitle: '5 coupons available', href: '/account/coupons', badge: '5' },
      // { icon: HelpCircle, title: 'Help Center', subtitle: 'FAQs & guides', href: '/help' },
      { icon: MessageCircle, title: 'Chat Support', subtitle: '24/7 assistance', href: '/support' },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export default function AccountPage() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const localUser = useMemo(() => {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  }, []);

  const userId = localUser?.id || '';

  const { data: userProfileData } = useUserQuery(userId, !!userId);
  const user = userProfileData?.data || localUser;

  useEffect(() => {
    if (!localStorage.getItem('user_token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    console.log('Logout clicked');
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.error('Logout error on backend:', err);
    }
    // Clear user tokens/sessions
    localStorage.removeItem('user_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    
    // Redirect to login screen
    navigate('/login');
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-secondary/30">
        {/* Mobile Header */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border lg:hidden">
          <div className="container-luxe py-3">
            <h1 className="font-display text-lg font-semibold">My Account</h1>
          </div>
        </div>

        <div className="pt-20 lg:pt-32 pb-24 lg:pb-16">
          <div className="container-luxe">
            {/* Desktop Title */}
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden lg:block font-display text-3xl md:text-4xl mb-8"
            >
              My Account
            </motion.h1>

            {/* Account Header */}
            <div className="mb-8">
              <AccountHeader
                user={user}
                onLogout={handleLogout}
                onEditProfile={handleEditProfile}
              />
            </div>

            {/* Main Grid Layout */}
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Dashboard Cards */}
              <div className="lg:col-span-2 space-y-6">
                {accountSections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.05 }}
                  >
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                      {section.title}
                    </h2>
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid sm:grid-cols-2 gap-3"
                    >
                      {section.items.map((item) => (
                        <AccountCard
                          key={item.title}
                          icon={item.icon}
                          title={item.title}
                          subtitle={item.subtitle}
                          href={item.href}
                          badge={item.badge}
                          variant={item.variant}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Right Column - Orders, Address, Security */}
              <div className="space-y-6">
                <OrdersPreview />
                <AddressPreview />
                {/* <SecuritySettings /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
