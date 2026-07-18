import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Smartphone, Shield, Key, AlertTriangle, ChevronRight, LogOut, CheckCircle2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const LoginSecurity = () => {
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Password Updated", {
            description: "Your password has been successfully changed."
        });
        setShowPasswordForm(false);
    };

    const toggle2FA = () => {
        setIs2FAEnabled(!is2FAEnabled);
        toast(is2FAEnabled ? "Two-Factor Authentication Disabled" : "Two-Factor Authentication Enabled", {
            description: is2FAEnabled
                ? "Your account is less secure now."
                : "We'll ask for a code when you log in on a new device."
        });
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-secondary/30 pt-32 pb-20">
                <div className="container-luxe max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
                            Login & Security
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your password and security settings.
                        </p>
                    </motion.div>

                    <div className="grid gap-8">
                        {/* Password Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-primary/10 rounded-lg h-fit">
                                            <Key className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold mb-1">Password</h2>
                                            <p className="text-muted-foreground text-sm">
                                                Last changed 3 months ago
                                            </p>
                                        </div>
                                    </div>
                                    {!showPasswordForm && (
                                        <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
                                            Update
                                        </Button>
                                    )}
                                </div>

                                {showPasswordForm && (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4 max-w-md ml-14"
                                        onSubmit={handlePasswordUpdate}
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <Button type="submit" className="btn-premium">Save Password</Button>
                                            <Button type="button" variant="ghost" onClick={() => setShowPasswordForm(false)}>Cancel</Button>
                                        </div>
                                    </motion.form>
                                )}
                            </div>
                        </motion.div>

                        {/* 2FA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-card rounded-xl border border-border/50 shadow-sm p-6 md:p-8"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                                        <Smartphone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold mb-1">Two-Factor Authentication</h2>
                                        <p className="text-muted-foreground text-sm max-w-lg mb-4">
                                            Add an extra layer of security to your account by requiring a verification code in addition to your password.
                                        </p>
                                        {is2FAEnabled && (
                                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Enabled</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Switch checked={is2FAEnabled} onCheckedChange={toggle2FA} />
                            </div>
                        </motion.div>

                        {/* Login History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-card rounded-xl border border-border/50 shadow-sm p-6 md:p-8"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-semibold">Recent Login Activity</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { device: 'MacBook Pro', location: 'New York, USA', time: 'Active now', icon: '💻' },
                                    { device: 'iPhone 13', location: 'New York, USA', time: '2 hours ago', icon: '📱' },
                                    { device: 'Chrome on Windows', location: 'New Jersey, USA', time: 'Yesterday', icon: '🖥️' },
                                ].map((login, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{login.icon}</span>
                                            <div>
                                                <p className="font-medium">{login.device}</p>
                                                <p className="text-sm text-muted-foreground">{login.location} • {login.time}</p>
                                            </div>
                                        </div>
                                        {i === 0 ? (
                                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Current</span>
                                        ) : (
                                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">Log out</Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Danger Zone */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 p-6 md:p-8"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-1">Delete Account</h2>
                                    <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                                        Permanently delete your account and all of your content. This action cannot be undone.
                                    </p>
                                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LoginSecurity;
