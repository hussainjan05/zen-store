import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductsScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const { data } = await api.get('/products?pageSize=200');
                setProducts(data.products);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching all products:', error);
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        (p.name || p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category?.name || p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-max px-6 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 mb-4">Explore Our Catalog</h1>
                <p className="text-slate-500 mb-8">Discover over 100+ premium products across various categories.</p>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products or categories..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors">
                        <SlidersHorizontal size={18} /> Filters
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-xl text-slate-500">No products found for "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsScreen;
