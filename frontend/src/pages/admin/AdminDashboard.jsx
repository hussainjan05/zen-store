import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
    Users,
    ShoppingBag,
    DollarSign,
    Package,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Activity,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Icon size={80} className={color.replace('bg-', 'text-')} />
        </div>

        <div className="flex items-start justify-between relative z-10">
            <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center text-opacity-100 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trendValue}%
                </div>
            )}
        </div>
        <div className="mt-8 relative z-10">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">{title}</h3>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                setStats(data);
            } catch (error) {
                console.error('Stats Fetch Error:', error);
                toast.error('Failed to synchronize dashboard metrics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (stats?.revenueData) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const formatted = stats.revenueData.map(d => ({
                name: months[d.month - 1],
                sales: d.revenue
            }));
            setChartData(formatted);
        }
    }, [stats]);

    if (loading) return (
        <div className="animate-pulse space-y-12">
            <div className="h-12 bg-slate-200 w-64 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(n => <div key={n} className="h-56 bg-white border border-slate-100 rounded-[2.5rem]"></div>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="h-96 bg-white border border-slate-100 rounded-[3rem]"></div>
                <div className="h-96 bg-white border border-slate-100 rounded-[3rem]"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-12 pb-10">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 mt-3 font-medium text-lg leading-relaxed max-w-xl">
                        Real-time analytics and performance metrics for your premium storefront.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-3 bg-white p-2 border border-slate-100 rounded-2xl shadow-sm">
                    <button className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20">All Time</button>
                    <button className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors">7 Days</button>
                    <button className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors">30 Days</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Gross Revenue"
                    value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    color="bg-brand-primary"
                    trend="up"
                    trendValue="12.5"
                />
                <StatCard
                    title="Total Sales"
                    value={stats?.totalOrders || 0}
                    icon={ShoppingBag}
                    color="bg-brand-secondary"
                    trend="up"
                    trendValue="8.2"
                />
                <StatCard
                    title="Active Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="bg-brand-accent"
                    trend="up"
                    trendValue="4.1"
                />
                <StatCard
                    title="Open Orders"
                    value={stats?.pendingOrders || 0}
                    icon={Clock}
                    color="bg-amber-500"
                    trend="down"
                    trendValue="2.4"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sales Chart */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Revenue Stream</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Live performance metrics</p>
                            </div>
                        </div>
                        <select className="bg-slate-100 border-none rounded-xl text-sm font-black px-6 py-3 focus:ring-4 focus:ring-brand-primary/10">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>

                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stock Alerts Small List */}
                <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center">
                            <Package className="mr-3 text-brand-primary" />
                            Inventory
                        </h3>
                        <div className="space-y-4">
                            {stats?.latestProducts?.length > 0 ? (
                                stats.latestProducts.map((product, n) => (
                                    <Link to={`/admin/products/${product._id}/edit`} key={product._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold">
                                                #{n + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-[13px]">{product.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">{product.category?.name || 'Catalog'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-brand-accent font-black text-xs">Stock: {product.stock}</p>
                                            <ChevronRight size={14} className="text-slate-600 inline-block ml-2 group-hover:translate-x-1 group-hover:text-brand-primary transition-all" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                [1, 2, 3, 4].map(n => (
                                    <div key={n} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                                            <div className="h-8 bg-white/10 w-32 rounded"></div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Link to="/admin/products" className="block">
                            <button className="w-full mt-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-black text-sm shadow-lg shadow-brand-primary/20 transition-all active:scale-95">
                                Manage Inventory
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
