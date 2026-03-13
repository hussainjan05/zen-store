import React from 'react';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-white/50">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 rounded-full blur-[120px] animate-pulse-slow transition-all duration-1000" />
            </div>

            <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <div className="text-center lg:text-left space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-bold text-sm"
                    >
                        <Sparkles size={16} />
                        <span>Discover the Future of Shopping</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight"
                    >
                        Elevate Your <br />
                        <span className="text-gradient">Daily Lifestyle.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
                    >
                        ZenStore brings you a curated selection of premium products, where elegance meets innovation. Experience shopping like never before.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                    >
                        <Button size="lg" className="h-16 px-10 group">
                            Start Shopping
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="secondary" size="lg" className="h-16 px-10">
                            Explore Collections
                        </Button>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center lg:justify-start gap-8 pt-6 border-t border-slate-200/60"
                    >
                        {[
                            { label: 'Premium Brands', value: '50+' },
                            { label: 'Happy Customers', value: '25k+' },
                            { label: 'Global Delivery', value: '24/7' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center lg:text-left">
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="relative hidden lg:block"
                >
                    <div className="relative z-10 w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl glass">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-brand-secondary/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <ShoppingBag className="w-48 h-48 text-brand-primary opacity-20" strokeWidth={1} />
                            </motion.div>
                        </div>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary rounded-full blur-[80px] opacity-40 -z-10 animate-pulse" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-secondary rounded-full blur-[80px] opacity-40 -z-10 animate-pulse" />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
