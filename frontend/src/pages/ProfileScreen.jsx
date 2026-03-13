import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import { useSocket } from '../context/SocketContext';

// Modular Components
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import OrderHistory from '../components/profile/OrderHistory';

const ProfileScreen = () => {
    const { user, dispatch, logout } = useAuth();
    const socket = useSocket();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: {
            street: user?.address?.street || '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            zipCode: user?.address?.zipCode || '',
            country: user?.address?.country || '',
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phoneNumber: data.phoneNumber || '',
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        state: data.address?.state || '',
                        zipCode: data.address?.zipCode || '',
                        country: data.address?.country || '',
                    }
                });
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('user:updated', (updatedUser) => {
                if (updatedUser._id === user?._id) {
                    dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
                    setFormData({
                        name: updatedUser.name || '',
                        email: updatedUser.email || '',
                        phoneNumber: updatedUser.phoneNumber || '',
                        address: {
                            street: updatedUser.address?.street || '',
                            city: updatedUser.address?.city || '',
                            state: updatedUser.address?.state || '',
                            zipCode: updatedUser.address?.zipCode || '',
                            country: updatedUser.address?.country || '',
                        }
                    });
                }
            });

            return () => {
                socket.off('user:updated');
            };
        }
    }, [socket, user?._id, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', formData);
            dispatch({ type: 'LOGIN_SUCCESS', payload: data });
            toast.success('Profile updated successfully!', {
                style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-32 bg-zinc-50/50 min-h-screen">
            <div className="container-max">
                <div className="flex flex-col lg:flex-row items-start gap-12">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-80 shrink-0">
                        <ProfileSidebar user={user} logout={logout} />
                    </div>

                    {/* Main Settings Area */}
                    <div className="flex-1 w-full space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-8 md:p-16 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-16">
                                        <div>
                                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
                                            <p className="text-slate-500 font-medium mt-2">Update your personal information and address book.</p>
                                        </div>
                                        <div className="hidden sm:flex w-16 h-16 rounded-3xl bg-slate-50 items-center justify-center text-slate-200">
                                            <Shield size={32} />
                                        </div>
                                    </div>

                                    <ProfileInfo
                                        formData={formData}
                                        setFormData={setFormData}
                                        handleSubmit={handleSubmit}
                                        loading={loading}
                                    />
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-8 md:p-16">
                                <OrderHistory />
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
