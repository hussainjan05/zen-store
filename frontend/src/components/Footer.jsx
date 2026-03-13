import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-slate-900 pt-24 pb-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-primary/10 blur-[120px] rounded-full -translate-y-1/2" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-brand-secondary/10 blur-[120px] rounded-full -translate-y-1/2" />

            <div className="container-max relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link to="/" className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary shadow-lg shadow-brand-primary/20" />
                            <span>ZenStore</span>
                        </Link>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                            Redefining the digital shopping experience with premium curated collections and unmatched service.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                                <motion.a
                                    key={idx}
                                    href="#"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-colors border border-slate-700/50"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-white font-bold text-lg">Shop</h3>
                        <ul className="space-y-4">
                            {['All Products', 'Featured', 'New Arrivals', 'Best Sellers'].map((item) => (
                                <li key={item}>
                                    <Link to="/search" className="text-slate-400 hover:text-brand-primary transition-colors flex items-center group">
                                        <ArrowRight size={14} className="mr-0 opacity-0 -ml-4 group-hover:opacity-100 group-hover:mr-2 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-white font-bold text-lg">Support</h3>
                        <ul className="space-y-4">
                            {['Order Status', 'Returns', 'Shipping', 'FAQs'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-slate-400 hover:text-brand-primary transition-colors flex items-center group">
                                        <ArrowRight size={14} className="mr-0 opacity-0 -ml-4 group-hover:opacity-100 group-hover:mr-2 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-4 space-y-6">
                        <h3 className="text-white font-bold text-lg">Join our newsletter</h3>
                        <p className="text-slate-400">Get the latest updates on new products and upcoming sales.</p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-6 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold transition-all">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} ZenStore. All rights reserved. Built with passion.
                    </p>
                    <div className="flex gap-8 text-sm font-medium text-slate-500">
                        <Link to="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-slate-300 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

