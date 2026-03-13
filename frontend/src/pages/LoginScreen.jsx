import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowRight, Loader, Sparkles, Fingerprint, Lock, AtSign, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
// emailjs removed to use backend NodeMailer instead

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Configuration from Environment Variables (EmailJS removed)

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!email) return toast.error('Please enter a valid credential');

        setLoading(true);

        try {
            const trimmedEmail = email.trim();
            // Send to Backend to Store AND Send Email
            await api.post('/auth/send-otp', { email: trimmedEmail });

            toast.success('Identity code dispatched', {
                style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
            });
            setStep(2);
            setTimer(60);
        } catch (error) {
            console.error('OTP Send Error:', error);
            toast.error(error.response?.data?.message || 'Transmission failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            await login(email, otp);
            toast.success('Access Granted. Welcome.', {
                icon: '🔐'
            });
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authorization rejected');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setLoading(true);
        try {
            const trimmedEmail = email.trim();
            // Backend now handles the email transmission via NodeMailer
            await api.post('/auth/resend', { email: trimmedEmail });

            toast.success('Code re-transmitted');
            setTimer(60);
        } catch (error) {
            console.error('Resend Error:', error);
            toast.error(error.response?.data?.message || 'Sync failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-brand-secondary/10 to-transparent rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl w-full relative z-10"
            >
                <div className="bg-white/70 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] border border-white/50 space-y-12 relative overflow-hidden">
                    {/* Decorative top pulse */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

                    <div className="text-center space-y-6">
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl relative group"
                        >
                            <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-full" />
                            <Fingerprint size={48} className="text-white relative z-10" />
                        </motion.div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                <Badge variant="purple" className="px-3 py-1 font-black uppercase text-[9px] tracking-[0.2em]">Secure Node 01</Badge>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                                {step === 1 ? 'ZenStore ID' : 'Auth Protocol'}
                            </h1>
                            <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                                {step === 1
                                    ? 'Authorize your session to access global inventory and commerce tools.'
                                    : `Enter the 6-digit cryptographic key sent to your outreach point.`
                                }
                            </p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] ml-1">Outreach Point (Email)</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">
                                            <AtSign size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-16 pr-8 h-20 rounded-3xl bg-slate-50/50 border-2 border-slate-50 focus:bg-white focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none font-black text-slate-900 placeholder:text-slate-200"
                                            placeholder="identity@zenstore.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleSendOtp}
                                    isLoading={loading}
                                    className="w-full h-20 text-xl font-black shadow-2xl shadow-brand-primary/20 group"
                                >
                                    <span>Initiate Protocol</span>
                                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em]">Verification Key</label>
                                        <button onClick={() => setStep(1)} className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">Revise Entry</button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            maxLength="6"
                                            required
                                            className="w-full text-center text-5xl font-black tracking-[0.5em] h-24 rounded-[2.5rem] bg-slate-50/50 border-2 border-slate-50 focus:bg-white focus:border-brand-primary/20 focus:ring-8 focus:ring-brand-primary/5 transition-all outline-none text-slate-900 placeholder:text-slate-100"
                                            placeholder="000000"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        />
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                disabled={timer > 0 || loading}
                                                className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap group disabled:opacity-50"
                                            >
                                                {timer > 0 ? `Retransmission available in ${timer}S` : <span className="text-brand-primary hover:tracking-[0.3em] transition-all underline decoration-2 underline-offset-4">Resend Access Key</span>}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleVerifyOtp}
                                    disabled={otp.length < 6}
                                    isLoading={loading}
                                    className="w-full h-20 text-xl font-black shadow-2xl shadow-brand-primary/20"
                                >
                                    <Lock className="mr-3" size={24} />
                                    <span>Authorize Session</span>
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-12 text-center space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-40">
                        End-to-end encrypted session • ZenStore Core v4
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginScreen;
