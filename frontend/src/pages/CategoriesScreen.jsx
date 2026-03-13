import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Layers, ChevronRight, Sparkles, Filter, PackageOpen, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const CategoriesScreen = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [prodLoading, setProdLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('cat') || null;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
                if (activeCategory) {
                    fetchProducts(activeCategory);
                } else if (data.length > 0) {
                    // Default to first category if none selected? 
                    // Or show a grid of all categories. Let's show a grid if no cat selected.
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const fetchProducts = async (catId) => {
        setProdLoading(true);
        try {
            const { data } = await api.get(`/products?category=${catId}`);
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        } finally {
            setProdLoading(false);
        }
    };

    useEffect(() => {
        if (activeCategory) {
            fetchProducts(activeCategory);
        }
    }, [activeCategory]);

    const handleCategoryClick = (id) => {
        setSearchParams({ cat: id });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="container-max py-20 pb-40">
            {!activeCategory ? (
                <div className="space-y-20">
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary font-black uppercase tracking-[0.2em] text-[10px]">
                            <Layers size={14} />
                            <span>Global Taxonomy</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
                            Explore Collections
                        </h1>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                            Discover curated artifacts across our specialized departments. Precision engineered for quality.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -10 }}
                                onClick={() => handleCategoryClick(cat._id)}
                                className="group relative aspect-[1.2/1] rounded-[3rem] overflow-hidden bg-slate-100 cursor-pointer shadow-xl hover:shadow-2xl transition-all border border-white"
                            >
                                <img
                                    src={cat.image || 'https://via.placeholder.com/600x500'}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">Browse Inventory</p>
                                        <h3 className="text-3xl font-black text-white tracking-tight">{cat.name}</h3>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity">{cat.description?.slice(0, 40)}...</span>
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-brand-primary transition-colors">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3 space-y-12 sticky top-28">
                        <div>
                            <button
                                onClick={() => setSearchParams({})}
                                className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand-primary transition-colors mb-8 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                    <ChevronRight size={16} className="rotate-180" />
                                </div>
                                <span className="text-xs uppercase tracking-widest">Global Catalog</span>
                            </button>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 ml-1">Departments</h2>
                            <div className="flex flex-col gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryClick(cat._id)}
                                        className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeCategory === cat._id
                                                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 translate-x-3'
                                                : 'bg-white border border-slate-50 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                            }`}
                                    >
                                        <span>{cat.name}</span>
                                        {activeCategory === cat._id && <Sparkles size={14} className="text-brand-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/20 rounded-full blur-2xl -mr-12 -mt-12" />
                            <div className="relative z-10 space-y-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-primary">
                                    <Filter size={18} />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest leading-none mt-2">Departmental Discovery</h4>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Narrowing discovery to specific taxonomy increases retrieval speed and relevance.</p>
                            </div>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="lg:col-span-9 space-y-12">
                        <div className="flex items-end justify-between border-b border-slate-100 pb-8">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                    {categories.find(c => c._id === activeCategory)?.name}
                                </h1>
                                <p className="text-slate-400 font-medium">{products.length} Items Indexed</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="purple" className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Lighthouse v4.0</Badge>
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <LayoutGrid size={18} />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {prodLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3, 4, 5, 6].map(n => (
                                        <div key={n} className="space-y-6 animate-pulse">
                                            <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem]" />
                                            <div className="px-2 space-y-3">
                                                <div className="h-4 bg-slate-50 rounded-full w-3/4" />
                                                <div className="h-4 bg-slate-50 rounded-full w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-32 text-center space-y-6"
                                >
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto">
                                        <PackageOpen size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-slate-900">Inventory Empty</h3>
                                        <p className="text-slate-400 text-sm max-w-xs mx-auto">No artifacts have been indexed for this specific department yet.</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {products.map((product, idx) => (
                                        <motion.div
                                            key={product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            )}
        </div>
    );
};

export default CategoriesScreen;
