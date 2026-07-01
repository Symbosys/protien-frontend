import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { RefreshCw, Truck, ShieldCheck, Clock, CheckCircle2, XCircle, HelpCircle, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from 'react-router-dom';

const ReturnAndRefund = () => {
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
            <div className="bg-secondary/30 min-h-screen">
                {/* Hero Section */}
                <section className="relative bg-background pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                    <div className="container-luxe relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
                                Return & <span className="text-gradient">Refund Policy</span>
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We want you to love your purchase. If you're not completely satisfied, we're here to help with a seamless return process.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Key Features Grid */}
                <section className="py-12 -mt-10 relative z-20">
                    <div className="container-luxe">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {[
                                {
                                    icon: <Clock className="w-8 h-8 text-primary" />,
                                    title: "30-Day Window",
                                    desc: "You have 30 days from delivery to request a return."
                                },
                                {
                                    icon: <Truck className="w-8 h-8 text-primary" />,
                                    title: "Free Return Shipping",
                                    desc: "We provide a prepaid shipping label for all eligible returns."
                                },
                                {
                                    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                                    title: "Fast Refunds",
                                    desc: "Refunds are processed within 5-7 business days of receipt."
                                }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="mb-4 p-3 bg-primary/5 rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Detailed Policy Content */}
                <section className="py-16">
                    <div className="container-luxe">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                            {/* Main Content */}
                            <div className="lg:col-span-8 space-y-12">

                                {/* Eligibility */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-card rounded-2xl p-8 shadow-sm border border-border/50"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <CheckCircle2 className="w-6 h-6 text-primary" />
                                        <h2 className="text-2xl font-display font-semibold">Eligibility for Returns</h2>
                                    </div>
                                    <div className="space-y-4 text-muted-foreground">
                                        <p>To be eligible for a return, your item must meet the following criteria:</p>
                                        <ul className="space-y-3 list-none pl-1">
                                            {[
                                                "Item must be unused and in the same condition that you received it.",
                                                "It must be in the original packaging with all tags attached.",
                                                "Receipt or proof of purchase is required.",
                                                "Items purchased on final sale are not eligible for return."
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>

                                {/* Non-returnable items */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-card rounded-2xl p-8 shadow-sm border border-border/50"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <XCircle className="w-6 h-6 text-destructive" />
                                        <h2 className="text-2xl font-display font-semibold">Non-Returnable Items</h2>
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                        Certain types of items cannot be returned for hygiene or safety reasons:
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {["Perishable goods (food, flowers)", "Intimate apparel & sanitary goods", "Gift cards", "Downloadable software products", "Personalized/Custom items"].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                                                <XCircle className="w-4 h-4 text-muted-foreground/70" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* FAQ Accordion */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <h2 className="text-2xl font-display font-semibold mb-6">Frequently Asked Questions</h2>
                                    <Accordion type="single" collapsible className="w-full space-y-4">
                                        <AccordionItem value="item-1" className="bg-card border border-border/50 rounded-xl px-6">
                                            <AccordionTrigger className="text-lg font-medium hover:no-underline">How do I start a return?</AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground pb-4">
                                                Visit our Returns Center, enter your order number and email address to start. Follow the instructions and select the items you want to return. Once your request is approved, you will get a confirmation email with shipping guidelines.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2" className="bg-card border border-border/50 rounded-xl px-6">
                                            <AccordionTrigger className="text-lg font-medium hover:no-underline">When will I get my refund?</AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground pb-4">
                                                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-3" className="bg-card border border-border/50 rounded-xl px-6">
                                            <AccordionTrigger className="text-lg font-medium hover:no-underline">Exchanges</AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground pb-4">
                                                We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at support@luxe.com.
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </motion.div>

                            </div>

                            {/* Sidebar / CTA */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 sticky top-24">
                                    <h3 className="text-xl font-semibold mb-4">Need to return an item?</h3>
                                    <p className="text-muted-foreground mb-6 text-sm">
                                        Ready to start your return? Have your order number and email handy.
                                    </p>
                                    <Button className="w-full btn-premium h-12 text-base" asChild>
                                        <Link to="/account/orders">
                                            Initiate Return <ArrowRight className="ml-2 w-4 h-4" />
                                        </Link>
                                    </Button>

                                    <div className="my-6 border-t border-border/50" />

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <HelpCircle className="w-5 h-5 text-primary mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-sm">Need Help?</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Our support team is available 24/7.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-primary mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-sm">Email Us</h4>
                                                <a href="mailto:support@luxe.com" className="text-xs text-muted-foreground mt-1 hover:text-primary transition-colors">support@luxe.com</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default ReturnAndRefund;
