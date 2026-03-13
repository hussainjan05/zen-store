import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, limit = 8 }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(limit)].map((_, n) => (
                    <div key={n} className="animate-pulse bg-white rounded-[2.5rem] border border-slate-100 p-4 h-[450px] shadow-sm">
                        <div className="bg-slate-50 rounded-[2rem] aspect-[4/5] mb-6"></div>
                        <div className="space-y-4 px-2">
                            <div className="h-5 bg-slate-50 rounded-full w-2/3"></div>
                            <div className="h-4 bg-slate-50 rounded-full w-1/2"></div>
                            <div className="h-8 bg-slate-50 rounded-full w-1/3 mt-6"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
            {products.map((product) => (
                <motion.div key={product._id} variants={item}>
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ProductGrid;
