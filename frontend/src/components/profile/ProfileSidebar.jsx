import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge';

const ProfileSidebar = ({ user, logout }) => {
    const location = useLocation();

    const sidebarItems = [
        { name: 'My Profile', icon: User, path: '/profile' },
        { name: 'Order History', icon: Package, path: '/orders' },
        { name: 'Saved Addresses', icon: MapPin, path: '/profile' },
        { name: 'Payment Methods', icon: CreditCard, path: '/profile' },
    ];

    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-brand-primary to-brand-secondary p-1 shadow-2xl mb-6">
                    <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center text-brand-primary font-black text-3xl uppercase tracking-tighter">
                        {user?.email[0]}
                    </div>
                </div>
                <h2 className="text-xl font-black text-slate-900 truncate max-w-full">{user?.email.split('@')[0]}</h2>
                <Badge variant="purple" className="mt-3 px-4 py-1.5 font-black uppercase text-[10px] tracking-widest">
                    Premium Member
                </Badge>
            </div>

            <div className="mt-12 space-y-2 relative z-10">
                {sidebarItems.map((item, idx) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={idx}
                            to={item.path}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold ${isActive
                                ? 'bg-brand-primary/10 text-brand-primary shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} className={isActive ? 'text-brand-primary' : 'text-slate-400'} />
                                <span className="text-sm">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight size={16} />}
                        </Link>
                    );
                })}

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 font-bold transition-all mt-4"
                >
                    <LogOut size={20} />
                    <span className="text-sm">Log out</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileSidebar;
