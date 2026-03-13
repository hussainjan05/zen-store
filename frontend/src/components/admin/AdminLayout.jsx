import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Bell, Search, User, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-zinc-50/50">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Admin Header */}
                <header className="h-20 glass sticky top-0 z-40 px-6 sm:px-10 flex items-center justify-between border-b border-slate-200/60">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl lg:hidden"
                        >
                            <SettingsIcon size={20} />
                        </button>

                        <div className="relative group max-w-md w-full hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-100 border-none focus:ring-4 focus:ring-brand-primary/10 text-sm transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-6">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-accent rounded-full border-2 border-white"></span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex"
                            >
                                <SettingsIcon size={20} />
                            </motion.button>
                        </div>

                        <div className="h-8 w-px bg-slate-200 mx-1 sm:mx-0"></div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold text-slate-900 leading-none">Admin Panel</p>
                                <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{user?.email.split('@')[0]}</p>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-brand-primary/20"
                            >
                                {user?.email[0].toUpperCase()}
                            </motion.div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-4 sm:p-10 flex-grow">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
