import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Users,
    Mail,
    Shield,
    ShieldCheck,
    Trash2,
    Search,
    Check,
    X,
    Loader,
    ChevronRight,
    AtSign,
    Lock,
    UserCheck,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Exterminate this user record? This action will permanently remove all associated data.')) {
            try {
                await api.delete(`/admin/users/${id}`);
                toast.success('User profile purged', {
                    style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
                });
                fetchUsers();
            } catch (error) {
                toast.error('Purge failed - insufficient permissions');
            }
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-brand-accent font-black uppercase tracking-[0.2em] text-xs">
                        <Users size={16} />
                        <span>Identity Management</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        User Directory
                    </h1>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="h-14 px-8 border-slate-200">
                        Registration Audit
                    </Button>
                    <div className="h-14 px-6 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl">
                        <span className="text-sm font-black uppercase tracking-widest">{filteredUsers.length} Active Records</span>
                    </div>
                </div>
            </div>

            <Card className="p-0 overflow-hidden relative border-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                {/* Search Header */}
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Find user by name, email or UID..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent/20 focus:bg-white focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                            <AtSign size={20} />
                        </div>
                        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                            <Lock size={20} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/30 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black">
                                <th className="px-10 py-6">Identity Profile</th>
                                <th className="px-10 py-6">Privileges</th>
                                <th className="px-10 py-6">System Joined</th>
                                <th className="px-10 py-6 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(n => (
                                        <tr key={n} className="animate-pulse">
                                            <td className="px-10 py-8"><div className="h-12 bg-slate-100 rounded-2xl w-64"></div></td>
                                            <td className="px-10 py-8"><div className="h-8 bg-slate-100 rounded-xl w-32"></div></td>
                                            <td className="px-10 py-8"><div className="h-8 bg-slate-100 rounded-xl w-24"></div></td>
                                            <td className="px-10 py-8"><div className="h-12 bg-slate-100 rounded-2xl w-12 ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.map((user, idx) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-brand-accent/5 transition-all group"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-accent/20 to-brand-accent/5 p-0.5 group-hover:scale-110 transition-transform duration-500">
                                                    <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center text-brand-accent font-black text-lg uppercase shadow-sm">
                                                        {user.email[0]}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-lg leading-tight group-hover:text-brand-accent transition-colors">{user.name || 'Anonymous Entity'}</p>
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                                        <Mail size={12} className="opacity-50" /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            {user.role === 'admin' ? (
                                                <Badge variant="purple" className="flex items-center gap-2 py-1.5 px-4 bg-brand-primary text-white border-none shadow-lg shadow-brand-primary/20">
                                                    <ShieldCheck size={14} className="animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Global Admin</span>
                                                </Badge>
                                            ) : (
                                                <Badge variant="blue" className="bg-slate-100 text-slate-500 border-none py-1.5 px-4">
                                                    <UserCheck size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest ml-1.5">Standard User</span>
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Membership Date</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                {user.role !== 'admin' ? (
                                                    <button
                                                        onClick={() => deleteHandler(user._id)}
                                                        className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-300 hover:text-brand-accent hover:border-brand-accent/30 transition-all flex items-center justify-center"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                ) : (
                                                    <div className="w-12 h-12 flex items-center justify-center text-brand-primary">
                                                        <Lock size={18} />
                                                    </div>
                                                )}
                                                <div className="w-10 h-10 flex items-center justify-center text-slate-200 cursor-default">
                                                    <ChevronRight size={24} />
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminUserList;
