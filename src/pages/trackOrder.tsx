import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, MapPin, Clock, ArrowRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [trackingResult, setTrackingResult] = useState<any>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            setTrackingResult({
                id: orderId,
                status: 'In Transit',
                estimatedDelivery: 'Dec 15, 2025',
                currentStep: 2,
                steps: [
                    { title: 'Order Placed', date: 'Dec 10, 2025', time: '10:30 AM', completed: true },
                    { title: 'Processing', date: 'Dec 11, 2025', time: '02:15 PM', completed: true },
                    { title: 'Shipped', date: 'Dec 12, 2025', time: '09:45 AM', completed: true },
                    { title: 'Out for Delivery', date: 'Expected Dec 15', time: '-', completed: false },
                    { title: 'Delivered', date: '-', time: '-', completed: false },
                ],
                items: [
                    { name: 'Premium Silk Scarf', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070&auto=format&fit=crop', price: 120 },
                    { name: 'Leather Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop', price: 250 }
                ]
            });
            setIsSearching(false);
        }, 1500);
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-secondary/30 pt-32 pb-20">
                <div className="container-luxe max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                            Track Your Order
                        </h1>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            Enter your order ID to see the current status and estimated delivery date of your package.
                        </p>
                    </motion.div>

                    {/* Search Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 mb-8"
                    >
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    placeholder="Enter Order ID (e.g., ORD-12345)"
                                    className="pl-10 h-12 text-base"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="h-12 px-8 btn-premium" disabled={isSearching}>
                                {isSearching ? 'Tracking...' : 'Track Order'}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Tracking Result */}
                    {trackingResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Status Card */}
                            <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
                                <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Order ID: <span className="font-medium text-foreground">{trackingResult.id}</span></p>
                                        <h2 className="text-2xl font-display font-semibold text-primary">
                                            {trackingResult.status}
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                                        <p className="font-medium text-lg">{trackingResult.estimatedDelivery}</p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="p-6 md:p-8 bg-secondary/20">
                                    <div className="relative">
                                        {/* Vertical Line for Mobile */}
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:hidden" />

                                        {/* Horizontal Line for Desktop */}
                                        <div className="hidden md:block absolute top-4 left-0 right-0 h-0.5 bg-border" />
                                        <div
                                            className="hidden md:block absolute top-4 left-0 h-0.5 bg-primary transition-all duration-1000"
                                            style={{ width: `${(trackingResult.currentStep / (trackingResult.steps.length - 1)) * 100}%` }}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
                                            {trackingResult.steps.map((step: any, index: number) => {
                                                const isCompleted = index <= trackingResult.currentStep;
                                                const isCurrent = index === trackingResult.currentStep;

                                                return (
                                                    <div key={index} className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-2">
                                                        {/* Dot */}
                                                        <div className={`
                              relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300
                              ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                              ${isCurrent ? 'ring-4 ring-primary/20' : ''}
                            `}>
                                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full bg-current" />}
                                                        </div>

                                                        {/* Text */}
                                                        <div className="md:text-center pt-1">
                                                            <p className={`font-medium text-sm ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                                {step.title}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {step.date}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {step.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
                                <h3 className="font-medium mb-4">Items in this shipment</h3>
                                <div className="space-y-4">
                                    {trackingResult.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Help Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-muted-foreground mb-4">Having trouble tracking your order?</p>
                        <Button variant="link" className="text-primary">
                            Contact Support <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
};

export default TrackOrder;
