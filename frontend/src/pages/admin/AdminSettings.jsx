import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Settings as SettingsIcon,
    Globe,
    Mail,
    CreditCard,
    Image as ImageIcon,
    Save,
    Loader,
    ShieldCheck,
    Check,
    Database,
    Zap,
    Lock,
    Phone,
    Monitor,
    Upload
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const AdminSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const getPublicIdFromUrl = (url) => {
        if (!url || !url.includes('cloudinary')) return null;
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        const folderPart = parts[parts.length - 2];
        const name = lastPart.split('.')[0];
        return `${folderPart}/${name}`;
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSettings(data);
            } catch (error) {
                toast.error('Identity crisis: Failed to load configuration');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append('image', file);
        setUploading(true);
        try {
            const { data } = await api.post('/uploads', uploadData);

            // Delete old logo from Cloudinary if it exists
            const oldPublicId = getPublicIdFromUrl(settings.siteLogo);
            if (oldPublicId) {
                api.delete(`/uploads/${oldPublicId}`).catch(err => console.error(err));
            }

            setSettings({ ...settings, siteLogo: data.image });
            toast.success('Brand identity asset updated');
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            await api.put('/settings', settings);
            toast.success('Core architecture updated successfully', {
                style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
            });
        } catch (error) {
            toast.error('Configuration synchronization failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Synchronizing Core Parameters...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-16 pb-32">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-brand-primary font-black uppercase tracking-[0.2em] text-xs">
                        <Database size={16} />
                        <span>Infrastructure Control</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Global Configuration
                    </h1>
                </div>
                <Button
                    loading={saving}
                    onClick={handleSubmit}
                    className="h-14 px-10 shadow-2xl shadow-brand-primary/20"
                >
                    <Save className="mr-3" size={20} />
                    Commit All Parameters
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Primary Config */}
                    <div className="lg:col-span-12">
                        <Card className="p-10 md:p-14 space-y-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                            <div className="relative z-10 space-y-12">
                                <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Global Branding</h2>
                                            <p className="text-slate-400 text-xs font-medium">Public facing identification settings.</p>
                                        </div>
                                    </div>
                                    <Badge variant="purple" className="px-4 py-1.5 font-black uppercase tracking-widest text-[9px]">Lighthouse v4.0</Badge>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Brand Identity (Logo)</label>
                                    <label className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-brand-primary/30 transition-all cursor-pointer group">
                                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                            {settings.siteLogo ? (
                                                <img src={settings.siteLogo} className="w-full h-full object-contain" alt="Site Logo" />
                                            ) : (
                                                <ImageIcon className="text-slate-200" size={32} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            {uploading ? (
                                                <div className="flex items-center gap-3">
                                                    <Loader className="w-5 h-5 animate-spin text-brand-primary" />
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Uploading...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Upload size={14} className="text-brand-primary" />
                                                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Upload New Logo</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-medium">PNG, SVG or WEBP recommended. High contrast preferred.</p>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" className="hidden" onChange={handleLogoUpload} />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <Input
                                        label="Organization Identity (Site Name)"
                                        icon={Monitor}
                                        value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                        className="h-16 font-black text-lg"
                                    />
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <CreditCard size={12} /> Currency Symbol Matrix
                                        </label>
                                        <input
                                            className="w-full px-8 h-16 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 transition-all font-black text-2xl text-slate-900"
                                            value={settings.currencySymbol}
                                            onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Communication */}
                    <div className="lg:col-span-7">
                        <Card className="p-10 md:p-12 space-y-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                    <Mail size={20} />
                                </div>
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Support Architecture</h2>
                            </div>

                            <div className="space-y-8">
                                <Input
                                    label="Administrative Outreach Email"
                                    icon={AtSign}
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                />
                                <Input
                                    label="Direct Support Hotline"
                                    icon={Phone}
                                    value={settings.contactPhone}
                                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Integrations */}
                    <div className="lg:col-span-5">
                        <Card className="p-10 md:p-12 bg-slate-900 border-none text-white relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-full blur-[80px]" />

                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-primary">
                                        <Zap size={20} />
                                    </div>
                                    <h2 className="text-sm font-black uppercase tracking-widest">Mail Transmission</h2>
                                </div>

                                <p className="text-xs text-slate-400 font-medium leading-relaxed">External SMTP gateway provided by EmailJS for seamless automated notifications.</p>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Service Protocol ID</label>
                                        <input
                                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-primary/30 outline-none text-sm font-mono tracking-tighter"
                                            value={settings.emailJsServiceId || ''}
                                            onChange={(e) => setSettings({ ...settings, emailJsServiceId: e.target.value })}
                                            placeholder="service_..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Template Identifier</label>
                                        <input
                                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-primary/30 outline-none text-sm font-mono tracking-tighter"
                                            value={settings.emailJsTemplateId || ''}
                                            onChange={(e) => setSettings({ ...settings, emailJsTemplateId: e.target.value })}
                                            placeholder="template_..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Cryptographic Public Key</label>
                                        <input
                                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-primary/30 outline-none text-sm font-mono tracking-tighter"
                                            value={settings.emailJsPublicKey || ''}
                                            onChange={(e) => setSettings({ ...settings, emailJsPublicKey: e.target.value })}
                                            placeholder="user_..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <Card className="p-8 border-dashed border-2 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                            <Lock size={20} />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="font-black text-slate-900 text-sm">Security Matrix Active</p>
                            <p className="text-xs text-slate-400 font-medium">Global changes are audited and logged against your administrator ID.</p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleSubmit}
                        loading={saving}
                        className="h-12 px-8 text-xs font-black min-w-[200px]"
                    >
                        Force Global Sync
                    </Button>
                </Card>
            </form>
        </div>
    );
};

export default AdminSettings;
