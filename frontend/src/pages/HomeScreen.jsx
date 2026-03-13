import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { ShoppingBag, ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products?pageSize=12');
                setProducts(data.products);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching home products:', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-slate-50">
                <div className="container-max grid lg:grid-cols-2 gap-12 items-center relative z-10 px-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-200">
                            <Zap size={14} /> New Season Arrival
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] mb-8">
                            Curated <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Premium</span> <br />
                            Collections.
                        </h1>
                        <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
                            Discover our handpicked selection of premium products crafted for quality and style. Experience e-commerce redefined.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/products"
                                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
                            >
                                <ShoppingBag size={20} /> Explore Products
                            </Link>
                            <Link
                                to="/categories"
                                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                            >
                                View Collections <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative hidden lg:block"
                    >
                        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl absolute -top-20 -right-20 animate-pulse" />
                        <div className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[3rem] p-8 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Hero"
                                className="rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 bg-white border-y border-slate-100">
                <div className="container-max px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Truck className="text-indigo-600" />, title: "Free Shipping", desc: "On all orders over $99" },
                        { icon: <ShieldCheck className="text-emerald-600" />, title: "Secure Payment", desc: "100% secure checkouts" },
                        { icon: <Zap className="text-amber-600" />, title: "Fast Delivery", desc: "Receive products in 2-4 days" }
                    ].map((f, i) => (
                        <div key={i} className="flex items-center gap-4 p-6 rounded-3xl hover:bg-slate-50 transition-colors group">
                            <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors">{f.icon}</div>
                            <div>
                                <h4 className="font-bold text-slate-800">{f.title}</h4>
                                <p className="text-sm text-slate-500">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="container-max px-6 py-24">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Featured Selection</h2>
                        <p className="text-slate-500">Our top trending products handpicked for you.</p>
                    </div>
                    <Link to="/products" className="text-indigo-600 font-bold hover:underline flex items-center gap-1 group">
                        View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomeScreen;
