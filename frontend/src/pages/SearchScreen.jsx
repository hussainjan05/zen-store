import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, PackageX, Loader, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const SearchScreen = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('keyword') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: catData } = await api.get('/categories');
                setCategories(catData);

                // Mapping frontend sort values to backend expected values
                const backendSort = sortBy === 'price_low' ? 'priceAsc' : sortBy === 'price_high' ? 'priceDesc' : 'newest';

                const { data: prodData } = await api.get(`/products?keyword=${query}&category=${selectedCategory}&sort=${backendSort}`);
                setProducts(prodData.products);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [query, selectedCategory, sortBy]);

    return (
        <div className="container-max py-20 space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-brand-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <Search size={14} />
                        <span>Query Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                        {query ? `Results for "${query}"` : 'Discovered Catalog'}
                    </h1>
                    <p className="text-slate-400 font-medium text-lg">Exploring {products.length} curated artifacts matching your parameters.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <select
                            className="h-14 pl-6 pr-12 rounded-2xl bg-white border border-slate-100 shadow-sm appearance-none font-black text-xs uppercase tracking-widest text-slate-600 outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Latest Arrivals</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        <ArrowUpDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-brand-primary transition-colors" />
                    </div>
                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                        <button className="p-2.5 rounded-xl bg-slate-900 text-white shadow-lg"><LayoutGrid size={18} /></button>
                        <button className="p-2.5 rounded-xl text-slate-300 hover:text-slate-900 transition-colors"><List size={18} /></button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                {/* Filtration Sidebar */}
                <aside className="lg:col-span-1 space-y-10 sticky top-28">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Taxonomy</h3>
                            <button onClick={() => setSelectedCategory('')} className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">Reset</button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    onClick={() => setSelectedCategory(cat._id)}
                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${selectedCategory === cat._id
                                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-2'
                                        : 'bg-white border border-slate-50 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                        }`}
                                >
                                    <span>{cat.name}</span>
                                    {selectedCategory === cat._id && <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-brand-primary/5 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl -mr-12 -mt-12" />
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest relative z-10">Pro Filters</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed relative z-10">Advanced parametric search allows for precise artifact discovery within the global matrix.</p>
                        <Button variant="outline" className="w-full h-10 text-[10px] relative z-10">Enable Advanced</Button>
                    </div>
                </aside>

                {/* Main Results */}
                <main className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} className="space-y-6">
                                        <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] animate-pulse" />
                                        <div className="space-y-3 px-2">
                                            <div className="h-6 bg-slate-50 rounded-lg w-3/4 animate-pulse" />
                                            <div className="h-4 bg-slate-50 rounded-lg w-1/2 animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-24 rounded-[4rem] text-center border-2 border-dashed border-slate-50 flex flex-col items-center gap-8"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                    <PackageX size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Zero Artifacts Identified</h3>
                                    <p className="text-slate-400 font-medium max-w-sm">Our query engine could not locate any parameters matching your request. Try neutralizing your filters.</p>
                                </div>
                                <Button onClick={() => { setSelectedCategory(''); setSortBy('newest'); }} variant="outline" className="px-10 h-14">Refresh Catalog</Button>
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
        </div>
    );
};

export default SearchScreen;
