import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './ui/Button';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?keyword=${searchTerm}`);
        }
    };

    const cartCount = cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'
                }`}
        >
            <nav
                className={`container-max glass flex items-center justify-between transition-all duration-300 ${isScrolled ? 'rounded-2xl mx-4 shadow-lg' : 'rounded-none bg-transparent border-transparent shadow-none'
                    } bg-white/70 backdrop-blur-xl border border-white/20 px-6 py-3`}
            >
                {/* Logo & Links */}
                <div className="flex items-center gap-12">
                    <Link to="/" className="text-2xl font-bold text-gradient flex items-center gap-2">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.5 }}
                            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600"
                        />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">ZenStore</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link to="/" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors uppercase tracking-wider">Home</Link>
                        <Link to="/products" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors uppercase tracking-wider">Explore</Link>

                        {/* Collections Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                                Collections
                                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                            </button>

                            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                <div className="w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {categories.map((cat, index) => (
                                        <Link
                                            key={index}
                                            to={`/category/${cat.name}`}
                                            className="block px-4 py-2.5 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all text-xs font-bold uppercase tracking-wide"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="hidden md:flex flex-1 max-w-lg mx-8 relative group"
                >
                    <motion.div
                        initial={false}
                        animate={{
                            width: isSearchFocused ? '100%' : '80%',
                            borderColor: isSearchFocused ? 'var(--color-brand-primary)' : 'rgba(226, 232, 240, 1)'
                        }}
                        className="relative w-full"
                    >
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isSearchFocused ? 'text-brand-primary' : 'text-slate-400'
                            }`} size={18} />
                        <input
                            type="text"
                            placeholder="Find products..."
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </motion.div>
                </form>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/cart" className="relative group">
                        <div className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
                            <ShoppingCart className="text-slate-700 group-hover:text-indigo-600 transition-colors" size={24} />
                        </div>
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    {user ? (
                        <div className="relative group">
                            <button className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl border border-slate-200 hover:border-indigo-600/30 hover:bg-slate-50 transition-all">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold uppercase text-sm shadow-md shadow-indigo-600/20">
                                    {user.email[0]}
                                </div>
                                <span className="text-sm font-semibold text-slate-700">Account</span>
                                <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 rounded-2xl p-2 hidden group-hover:block transition-all border border-slate-800 shadow-2xl">
                                <div className="p-3 mb-1">
                                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                                    <p className="text-sm text-white font-bold truncate">{user.email}</p>
                                </div>
                                <div className="h-px bg-slate-800 mb-1 mx-2" />
                                <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white transition-all text-sm">
                                    <User size={16} /> Profile
                                </Link>
                                <Link to="/orders" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white transition-all text-sm">
                                    <ShoppingCart size={16} /> My Orders
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all text-sm font-bold">
                                        Admin Dashboard
                                    </Link>
                                )}
                                <div className="h-px bg-slate-800 my-1 mx-2" />
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all text-sm"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Button size="sm">Login</Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <Link to="/cart" className="relative p-2">
                        <ShoppingCart className="text-slate-700" size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-900"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[51]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[52] shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Menu</span>
                                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSearch} className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                <div className="flex flex-col gap-2">
                                    <Link onClick={() => setIsOpen(false)} to="/" className="p-4 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-3">
                                        Home
                                    </Link>
                                    <Link onClick={() => setIsOpen(false)} to="/products" className="p-4 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-3">
                                        Explore Products
                                    </Link>

                                    <div className="mt-4 mb-2 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Collections</div>
                                    <div className="grid grid-cols-1 gap-1">
                                        {categories.map((cat, index) => (
                                            <Link
                                                key={index}
                                                onClick={() => setIsOpen(false)}
                                                to={`/category/${cat.name}`}
                                                className="p-4 py-3 rounded-xl hover:bg-indigo-50 font-bold text-slate-600 text-sm flex items-center gap-3"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>

                                    {user ? (
                                        <>
                                            <div className="h-px bg-slate-100 my-4" />
                                            <Link onClick={() => setIsOpen(false)} to="/profile" className="p-4 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-3">
                                                My Profile
                                            </Link>
                                            <Link onClick={() => setIsOpen(false)} to="/orders" className="p-4 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-3">
                                                My Orders
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link onClick={() => setIsOpen(false)} to="/admin" className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center gap-3">
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => { logout(); setIsOpen(false); }}
                                                className="p-4 rounded-2xl hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-3 text-left"
                                            >
                                                <LogOut size={20} /> Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link onClick={() => setIsOpen(false)} to="/login" className="mt-4">
                                            <Button className="w-full py-4 text-lg">Login / Sign Up</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;

