import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useUserQuery, useUpdateUserMutation } from '@/api/hooks/user.hooks';
import { toast } from 'sonner';
import {
    User,
    Mail,
    Phone,
    Camera,
    Edit2,
    Save,
    X,
    Info,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';

interface CategoryItem {
  name: string;
  image: string | null;
}

export default function PersonalInformation() {
    const navigate = useNavigate();
    const updateMutation = useUpdateUserMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Inline edit states for email and phone
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');

    // Fetch user info from localStorage and API
    const localUser = useMemo(() => {
        try {
            const userString = localStorage.getItem('user');
            return userString ? JSON.parse(userString) : null;
        } catch {
            return null;
        }
    }, []);

    const userId = localUser?.id || '';

    const { data: userProfileData, isLoading: isProfileLoading } = useUserQuery(userId, !!userId);
    const user = userProfileData?.data || localUser;

    // Form data state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        email: '',
        phone: '',
        dob: ''
    });

    // Check Authentication
    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('user_token')) {
            navigate('/login');
        }
    }, [navigate]);

    // Sync state with fetched user data
    useEffect(() => {
        if (user) {
            let formattedDob = '';
            if (user.dateOfBirth) {
                try {
                    formattedDob = new Date(user.dateOfBirth).toISOString().split('T')[0];
                } catch {
                    formattedDob = user.dateOfBirth;
                }
            }
            setFormData({
                firstName: user.firstName || 'Amit',
                lastName: user.lastName || 'Das',
                gender: user.gender || 'Male',
                email: user.email || 'amit.das@example.com',
                phone: user.phoneNumber || '+91 98765 43210',
                dob: formattedDob || '1995-08-15'
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Save profile details (name, gender, dob)
    const handleSave = async () => {
        if (!userId) {
            toast.error('User ID not found. Please log in again.');
            return;
        }
        setLoading(true);
        try {
            await updateMutation.mutateAsync({
                id: userId,
                data: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    gender: formData.gender,
                    dateOfBirth: formData.dob
                }
            });
            // Update local storage user record
            const stored = localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed.firstName = formData.firstName;
                parsed.lastName = formData.lastName;
                parsed.gender = formData.gender;
                parsed.dateOfBirth = formData.dob;
                localStorage.setItem('user', JSON.stringify(parsed));
            }
            toast.success('Profile details updated successfully!');
            setIsEditing(false);
        } catch (error: any) {
            console.error('Failed to save profile changes:', error);
            toast.error(error?.response?.data?.message || 'Failed to update profile details.');
        } finally {
            setLoading(false);
        }
    };

    // Save email address changes
    const handleUpdateEmail = async () => {
        if (!userId) {
            toast.error('User ID not found.');
            return;
        }
        if (!emailInput.trim()) {
            toast.error('Please enter a valid email address.');
            return;
        }
        setLoading(true);
        try {
            await updateMutation.mutateAsync({
                id: userId,
                data: { email: emailInput.trim() }
            });
            // Update local storage user record
            const stored = localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed.email = emailInput.trim();
                localStorage.setItem('user', JSON.stringify(parsed));
            }
            setFormData(prev => ({ ...prev, email: emailInput.trim() }));
            toast.success('Email address updated successfully!');
            setIsEditingEmail(false);
        } catch (error: any) {
            console.error('Failed to update email:', error);
            toast.error(error?.response?.data?.message || 'Failed to update email address.');
        } finally {
            setLoading(false);
        }
    };

    // Save mobile number changes
    const handleUpdatePhone = async () => {
        if (!userId) {
            toast.error('User ID not found.');
            return;
        }
        if (!phoneInput.trim()) {
            toast.error('Please enter a valid mobile number.');
            return;
        }
        setLoading(true);
        try {
            await updateMutation.mutateAsync({
                id: userId,
                data: { phoneNumber: phoneInput.trim() }
            });
            // Update local storage user record
            const stored = localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed.phoneNumber = phoneInput.trim();
                localStorage.setItem('user', JSON.stringify(parsed));
            }
            setFormData(prev => ({ ...prev, phone: phoneInput.trim() }));
            toast.success('Mobile number updated successfully!');
            setIsEditingPhone(false);
        } catch (error: any) {
            console.error('Failed to update phone number:', error);
            toast.error(error?.response?.data?.message || 'Failed to update mobile number.');
        } finally {
            setLoading(false);
        }
    };

    if (isProfileLoading) {
        return (
            <MainLayout>
                <div className="pt-32 pb-16 bg-background/50">
                    <div className="container-luxe max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="h-10 w-64 bg-secondary/50 animate-pulse rounded mb-4" />
                        <div className="h-4 w-48 bg-secondary/50 animate-pulse rounded mb-12" />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="h-96 bg-secondary/30 animate-pulse rounded-xl" />
                                <div className="h-48 bg-secondary/30 animate-pulse rounded-xl" />
                            </div>
                            <div className="space-y-6">
                                <div className="h-64 bg-secondary/30 animate-pulse rounded-xl" />
                                <div className="h-32 bg-secondary/30 animate-pulse rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-background font-sans text-foreground pb-20 mt-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Personal Information</h1>
                        <p className="text-muted-foreground mt-1">Manage your personal details and public profile.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column - Main Form */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Profile Card */}
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

                                    {/* Avatar Section */}
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                                            <User className="w-10 h-10 text-muted-foreground" />
                                        </div>
                                        <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors" title="Change Photo">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-foreground">{formData.firstName} {formData.lastName}</h2>
                                        <p className="text-sm text-muted-foreground mt-1">{formData.email}</p>

                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${isEditing ? 'opacity-100' : 'opacity-80 pointer-events-none'}`}>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Gender</label>
                                        <div className="flex gap-4 pt-1">
                                            {['Male', 'Female', 'Other'].map((g) => (
                                                <label key={g} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.gender === g
                                                        ? 'bg-primary/10 border-primary text-primary'
                                                        : 'bg-background border-input text-muted-foreground hover:border-primary/50'
                                                    } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value={g}
                                                        checked={formData.gender === g}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        className="hidden"
                                                    />
                                                    <span className="text-sm font-medium">{g}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        />
                                    </div>

                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="mt-8 flex items-center gap-4 pt-6 border-t border-border animate-fade-in">
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:opacity-70"
                                        >
                                            {loading ? 'Saving...' : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            disabled={loading}
                                            className="inline-flex items-center justify-center px-6 py-2.5 bg-background border border-border text-foreground text-sm font-medium rounded-xl hover:bg-muted transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Contact Info (Separate Card for Security Context) */}
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-foreground">Contact Details</h3>
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Verified
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {/* Email Address Block */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Email Address</p>
                                                <p className="text-sm text-muted-foreground">{formData.email}</p>
                                            </div>
                                        </div>
                                        {isEditingEmail ? (
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <input
                                                    type="email"
                                                    value={emailInput}
                                                    onChange={(e) => setEmailInput(e.target.value)}
                                                    className="px-3 py-1.5 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-48 text-foreground"
                                                />
                                                <button
                                                    onClick={handleUpdateEmail}
                                                    disabled={loading}
                                                    className="text-xs font-semibold text-primary px-3 py-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 disabled:opacity-50"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setIsEditingEmail(false)}
                                                    disabled={loading}
                                                    className="text-xs font-semibold text-muted-foreground px-3 py-1.5 bg-muted rounded-lg hover:bg-muted/80 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setIsEditingEmail(true); setEmailInput(formData.email); }}
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                Update
                                            </button>
                                        )}
                                    </div>

                                    {/* Mobile Number Block */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Mobile Number</p>
                                                <p className="text-sm text-muted-foreground">{formData.phone}</p>
                                            </div>
                                        </div>
                                        {isEditingPhone ? (
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <input
                                                    type="text"
                                                    value={phoneInput}
                                                    onChange={(e) => setPhoneInput(e.target.value)}
                                                    className="px-3 py-1.5 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-48 text-foreground"
                                                />
                                                <button
                                                    onClick={handleUpdatePhone}
                                                    disabled={loading}
                                                    className="text-xs font-semibold text-primary px-3 py-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 disabled:opacity-50"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setIsEditingPhone(false)}
                                                    disabled={loading}
                                                    className="text-xs font-semibold text-muted-foreground px-3 py-1.5 bg-muted rounded-lg hover:bg-muted/80 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setIsEditingPhone(true); setPhoneInput(formData.phone); }}
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                Update
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column - FAQs / Info */}
                        <div className="space-y-6">
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-foreground mb-4">FAQs</h3>
                                <div className="space-y-4">
                                    {[
                                        { q: 'Why is my date of birth needed?', a: 'We use your date of birth to send you exclusive birthday offers and personalized recommendations.' },
                                        { q: 'What happens when I update my email?', a: 'Your login email will change, and we will send a verification link to the new address.' },
                                        { q: 'Is my personal information safe?', a: 'Yes, we use industry-standard encryption to protect your data. We never share it without your consent.' }
                                    ].map((faq, idx) => (
                                        <div key={idx} className="pb-4 border-b border-border last:border-0 last:pb-0">
                                            <h4 className="text-sm font-medium text-foreground mb-1">{faq.q}</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-foreground">Complete your profile</h4>
                                        <p className="text-xs text-muted-foreground mt-1 mb-3">
                                            Add your alternate mobile number and permanent address to speed up checkout.
                                        </p>
                                        <button className="text-xs font-semibold text-primary hover:underline flex items-center">
                                            Complete Now <ChevronRight className="w-3 h-3 ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
