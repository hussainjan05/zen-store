import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    ClipboardList,
    Settings as SettingsIcon,
    Star,
    Ticket,
    LogOut,
    ChevronRight,
    Layers,
    ExternalLink,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { title: 'Products', icon: ShoppingBag, path: '/admin/products' },
        { title: 'Categories', icon: Layers, path: '/admin/categories' },
        { title: 'Orders', icon: ClipboardList, path: '/admin/orders' },
        { title: 'Users', icon: Users, path: '/admin/users' },
        { title: 'Reviews', icon: Star, path: '/admin/reviews' },
        { title: 'Coupons', icon: Ticket, path: '/admin/coupons' },
        { title: 'Settings', icon: SettingsIcon, path: '/admin/settings' },
    ];

    const SidebarContent = () => (
        <div className="h-full bg-slate-950 text-white flex flex-col overflow-hidden">
            <div className="p-8 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 transition-transform group-hover:rotate-12">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">ZEN<span className="text-brand-primary">ADMIN</span></h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">v2.1 Premium</p>
                    </div>
                </Link>
                {/* Mobile close button */}
                <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X size={20} className="text-slate-400" />
                </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group relative ${isActive
                                ? 'bg-brand-primary/10 text-brand-primary shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
                                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                                }`}
                        >
                            <div className="flex items-center gap-3.5 relative z-10">
                                <item.icon size={20} className={`transition-colors duration-300 ${isActive ? 'text-brand-primary' : 'text-slate-600 group-hover:text-slate-300'}`} />
                                <span className={`font-bold text-sm transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>{item.title}</span>
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-brand-primary/5 rounded-xl border border-brand-primary/20"
                                />
                            )}

                            {isActive && <ChevronRight size={16} className="relative z-10 text-brand-primary" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 space-y-4 border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
                <Link to="/" target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300 mb-0.5">Live Storefront</span>
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">External Link</span>
                    </div>
                    <ExternalLink size={16} className="text-slate-500 group-hover:text-brand-primary transition-colors" />
                </Link>

                <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-black text-xs uppercase tracking-widest group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Authorize Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-72 h-screen flex-shrink-0 sticky top-0 hidden lg:block">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Trigger & Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] z-[61] lg:hidden shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSidebar;
