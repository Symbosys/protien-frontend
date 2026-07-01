import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowRight, Heart, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

import { toast } from 'sonner';

const SavedItems = () => {
    const { items, removeItem } = useWishlist();
    const { addItem } = useCart();

    const handleMoveToBag = (item: typeof items[0]) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
        });

        removeItem(item.id);
        toast.success("Moved to bag", {
            description: `${item.name} has been moved to your shopping bag.`
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-secondary/30 pt-32 pb-20">
                <div className="container-luxe">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
                                    Saved Items
                                </h1>
                                <p className="text-muted-foreground">
                                    {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
                                </p>
                            </div>
                            <Button variant="outline" asChild className="hidden sm:flex">
                                <Link to="/products">
                                    Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>

                        {items.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-card rounded-2xl p-12 text-center border border-border/50 shadow-sm"
                            >
                                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-10 h-10 text-muted-foreground/40" />
                                </div>
                                <h2 className="text-2xl font-semibold mb-3">Your saved list is empty</h2>
                                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                    Items you save for later will appear here. Keep track of products you love but aren't ready to buy yet.
                                </p>
                                <Button size="lg" className="btn-premium" asChild>
                                    <Link to="/products">Explore Collections</Link>
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        layout
                                        className="group bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white text-destructive hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {/* Quick Action Overlay for Mobile/Desktop */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                                                {/* Optional: Add size selector or quick view here if needed */}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="mb-4">
                                                <Link to={`/product/${item.id}`} className="block">
                                                    <h3 className="font-medium text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                                                        {item.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-muted-foreground text-sm font-medium">
                                                    ${item.price.toLocaleString()}
                                                </p>
                                            </div>

                                            <Button
                                                className="w-full gap-2"
                                                onClick={() => handleMoveToBag(item)}
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                Move to Bag
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Recommendations or Info Section */}
                        {items.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-12 bg-primary/5 rounded-xl p-6 flex items-start gap-4 border border-primary/10"
                            >
                                <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium mb-1">Price & Availability</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Prices and availability of saved items are subject to change. Moving an item to your bag does not reserve it until you complete checkout.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SavedItems;
