import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  User,
  MapPin,
  Heart,
  MessageCircle,
  LogOut,
  ChevronRight,
  Loader2,
  ShoppingBag,
  Settings,
  Shield,
  Bell,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';

import { useUserQuery, useUpdateUserMutation } from '@/api/hooks/user.hooks';
import { useLogoutMutation } from '@/api/hooks/auth.hooks';
import { toast } from 'sonner';

const quickLinks = [
  { icon: ShoppingBag, label: 'My Orders', desc: 'View & track orders', href: '/account/orders', color: 'bg-blue-50 text-blue-600' },
  { icon: MapPin, label: 'Addresses', desc: 'Manage delivery locations', href: '/account/addresses', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Heart, label: 'Wishlist', desc: 'Items you love', href: '/wishlist', color: 'bg-rose-50 text-rose-600' },
  { icon: MessageCircle, label: 'Support', desc: '24/7 assistance', href: '/support', color: 'bg-violet-50 text-violet-600' },
  { icon: Truck, label: 'Track Order', desc: 'Real-time tracking', href: '/track-order', color: 'bg-amber-50 text-amber-600' },
  // { icon: Shield, label: 'Security', desc: 'Password & security', href: '/account/security', color: 'bg-gray-50 text-gray-600' },
];

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

  const { data: userProfileData, isLoading: isLoadingProfile } = useUserQuery(userId, !!userId);
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
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.error('Logout error on backend:', err);
    }
    localStorage.removeItem('user_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) { toast.error('First name is required'); return; }
    if (!email.trim()) { toast.error('Email address is required'); return; }
    updateUserMutation.mutate(
      { id: userId, data: { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), phoneNumber: phoneNumber.trim() } },
      {
        onSuccess: (response) => {
          toast.success('Profile updated successfully');
          if (response?.data) localStorage.setItem('user', JSON.stringify(response.data));
        },
        onError: (err: any) => toast.error(err.message || 'Failed to update profile'),
      }
    );
  };

  const initials = useMemo(() => {
    const f = (firstName || '').trim().charAt(0).toUpperCase();
    const l = (lastName || '').trim().charAt(0).toUpperCase();
    return (f + l) || 'U';
  }, [firstName, lastName]);

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Welcome';

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F8FA] text-black">

        {/* ── Hero Banner ───────────────────────────── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row sm:items-center gap-5"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white tracking-widest">{initials}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>

              {/* Name block */}
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">My Account</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">{fullName}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{email || 'No email set'}</p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* ── Left column ─────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Quick Links Grid */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 }}
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Access</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {quickLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.04 }}
                      whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    >
                      <Link
                        to={link.href}
                        className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${link.color}`}>
                          <link.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-black leading-none mb-0.5">{link.label}</p>
                          <p className="text-[11px] text-gray-400 truncate">{link.desc}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 ml-auto transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>


            </div>

            {/* ── Right column — profile form ──────── */}
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-28"
              >
                {/* Card header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <h2 className="text-sm font-bold text-black">Personal Information</h2>
                  </div>
                  <Settings className="w-4 h-4 text-gray-300" />
                </div>

                {/* Form body */}
                {isLoadingProfile ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    <span className="text-xs text-gray-400">Loading…</span>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="w-full px-3 py-2 text-sm bg-[#F7F8FA] border border-gray-200 rounded-lg text-black placeholder-gray-300 focus:bg-white focus:border-black focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="w-full px-3 py-2 text-sm bg-[#F7F8FA] border border-gray-200 rounded-lg text-black placeholder-gray-300 focus:bg-white focus:border-black focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 text-sm bg-[#F7F8FA] border border-gray-200 rounded-lg text-black placeholder-gray-300 focus:bg-white focus:border-black focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full px-3 py-2 text-sm bg-[#F7F8FA] border border-gray-200 rounded-lg text-black placeholder-gray-300 focus:bg-white focus:border-black focus:outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updateUserMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-900 disabled:opacity-50 transition-colors mt-1"
                    >
                      {updateUserMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Save Changes
                    </button>
                  </form>
                )}

                {/* Divider + extra links */}
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                  {/* <Link
                    to="/account/security"
                    className="flex items-center justify-between px-5 py-3 text-xs font-semibold text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" />Login & Security</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </Link> */}
                  <Link
                    to="/account/addresses"
                    className="flex items-center justify-between px-5 py-3 text-xs font-semibold text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />Manage Addresses</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </Link>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
