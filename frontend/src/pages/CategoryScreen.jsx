import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { ChevronRight, LayoutGrid } from 'lucide-react';

const CategoryScreen = () => {
    const { name } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/products?categoryName=${name}&pageSize=100`);
                setProducts(data.products);
                setLoading(false);
            } catch (error) {
                console.error(`Error fetching category ${name}:`, error);
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, [name]);

    return (
        <div className="container-max px-6 py-12">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                <Link to="/" className="hover:text-indigo-600">Home</Link>
                <ChevronRight size={12} />
                <Link to="/products" className="hover:text-indigo-600">Explore</Link>
                <ChevronRight size={12} />
                <span className="text-indigo-600">{name.replace(/-/g, ' ')}</span>
            </div>

            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 capitalize">{name.replace(/-/g, ' ')}</h1>
                    <p className="text-slate-500">Showing all premium products in {name.replace(/-/g, ' ')} collection.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
                    <LayoutGrid size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                ) : products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-xl text-slate-500">No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryScreen;
