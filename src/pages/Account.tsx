import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  User,
  MapPin,
  Heart,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import AccountHeader from '@/components/account/AccountHeader';
import AccountCard from '@/components/account/AccountCard';
import OrdersPreview from '@/components/account/OrdersPreview';
import AddressPreview from '@/components/account/AddressPreview';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useUserQuery, useUpdateUserMutation } from '@/api/hooks/user.hooks';
import { useLogoutMutation } from '@/api/hooks/auth.hooks';
import { toast } from 'sonner';

interface AccountItem {
  icon: any;
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
}

interface AccountSection {
  title: string;
  items: AccountItem[];
}

const accountSections: AccountSection[] = [
  {
    title: 'Orders & Tracking',
    items: [
      { icon: Package, title: 'My Orders', subtitle: 'View & track orders', href: '/account/orders' },
      { icon: Truck, title: 'Track Orders', subtitle: 'Real-time tracking', href: '/track-order' },
    ],
  },
  {
    title: 'Account Settings',
    items: [
      { icon: User, title: 'Personal Information', subtitle: 'Name, email, phone', href: '/account/personal-information' },
      { icon: MapPin, title: 'Saved Addresses', subtitle: 'Manage delivery addresses', href: '/account/addresses' },
    ],
  },
  {
    title: 'My Stuff',
    items: [
      { icon: Heart, title: 'Wishlist', subtitle: 'Items you love', href: '/wishlist', badge: '12' },
    ],
  },
  {
    title: 'Rewards & Support',
    items: [
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
  const updateUserMutation = useUpdateUserMutation();

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

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('user_token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

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

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email address is required");
      return;
    }

    updateUserMutation.mutate(
      {
        id: userId,
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        },
      },
      {
        onSuccess: (response) => {
          toast.success("Profile updated successfully");
          if (response?.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update profile");
        },
      }
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FAF9F6] text-black">
        {/* Mobile Header */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 lg:hidden">
          <div className="container py-3 px-4">
            <h1 className="text-lg font-bold text-black">My Account</h1>
          </div>
        </div>

        <div className="pt-20 lg:pt-32 pb-24 lg:pb-16 max-w-6xl mx-auto px-4">
          <div className="container-luxe">
            {/* Desktop Title */}
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden lg:block font-bold text-3xl mb-8 text-black"
            >
              My Account
            </motion.h1>

            {/* Account Header */}
            <div className="mb-8">
              <AccountHeader
                user={user}
                onLogout={handleLogout}
                onEditProfile={() => {
                  const targetElement = document.getElementById("profile-form-section");
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            </div>

            {/* Main Grid Layout */}
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Left Column - Dashboard Cards */}
              <div className="lg:col-span-2 space-y-6">
                {accountSections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.05 }}
                  >
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
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
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Right Column - Profile Form & Previews */}
              <div className="space-y-6">
                
                {/* Profile Form Card */}
                <motion.div
                  id="profile-form-section"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                    <User className="w-4.5 h-4.5 text-black" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                      Personal Information
                    </h2>
                  </div>
                  
                  <div className="p-5">
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-lg text-black focus:border-black focus:outline-none transition-colors shadow-sm"
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-lg text-black focus:border-black focus:outline-none transition-colors shadow-sm"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-lg text-black focus:border-black focus:outline-none transition-colors shadow-sm"
                          placeholder="john.doe@example.com"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-lg text-black focus:border-black focus:outline-none transition-colors shadow-sm"
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={updateUserMutation.isPending}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-colors shadow-sm"
                        >
                          {updateUserMutation.isPending && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          )}
                          Save Changes
                        </button>
                      </div>

                    </form>
                  </div>
                </motion.div>

                {/* Previews */}
                <OrdersPreview />
                <AddressPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
