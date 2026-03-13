import React from 'react';
import { User, Phone, MapPin, Save } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ProfileInfo = ({ formData, setFormData, handleSubmit, loading }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-16">
            {/* Basic Info */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <User size={20} />
                    </div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em]">Personal Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                        label="Full Name"
                        icon={User}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                    />
                    <Input
                        label="Phone Number"
                        icon={Phone}
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
            </section>

            {/* Address Section */}
            <section className="space-y-10">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                        <MapPin size={20} />
                    </div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em]">Address Book</h3>
                </div>

                <div className="space-y-8">
                    <Input
                        label="Street Address"
                        icon={MapPin}
                        value={formData.address.street}
                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                        placeholder="123 Luxury Avenue"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Input
                            label="City"
                            value={formData.address.city}
                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                            placeholder="San Francisco"
                        />
                        <Input
                            label="Zip Code"
                            value={formData.address.zipCode}
                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                            placeholder="94103"
                        />
                        <Input
                            label="Country"
                            value={formData.address.country}
                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                            placeholder="United States"
                        />
                    </div>
                </div>
            </section>

            <div className="pt-8 flex justify-end">
                <Button
                    type="submit"
                    loading={loading}
                    size="lg"
                    className="h-16 px-12 text-lg font-black group shadow-2xl shadow-brand-primary/20"
                >
                    <Save className="mr-3 group-hover:rotate-12 transition-transform" />
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default ProfileInfo;
