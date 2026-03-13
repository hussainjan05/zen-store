import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const OtpLogin = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!email) return toast.error('Please enter a valid email');

        setLoading(true);
        try {
            // Backend generates OTP and sends email via NodeMailer
            await api.post('/auth/send-otp', { email: email.trim() });

            setIsOtpSent(true);
            setTimer(60);
            toast.success('OTP sent successfully!');
        } catch (error) {
            console.error('OTP Error:', error);
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) return toast.error('Please enter the full 6-digit code');

        setLoading(true);
        try {
            const { data } = await api.post('/auth/verify-otp', { email: email.trim(), otp: fullOtp });
            if (data.token) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                toast.success('Login Successful! Redirecting...');
                window.location.href = '/';
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.glassCard}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Secure Login</h1>
                    <p style={styles.subtitle}>
                        {!isOtpSent ? 'Enter your email to receive a verification code' : `Code sent to ${email}`}
                    </p>
                </div>

                {!isOtpSent ? (
                    <form onSubmit={handleSendOtp} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={styles.primaryButton}>
                            {loading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} style={styles.form}>
                        <div style={styles.otpGrid}>
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`otp-${idx}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                                            document.getElementById(`otp-${idx - 1}`).focus();
                                        }
                                    }}
                                    style={styles.otpInput}
                                />
                            ))}
                        </div>
                        <button type="submit" disabled={loading} style={styles.primaryButton}>
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <div style={styles.footer}>
                            {timer > 0 ? (
                                <p style={styles.timerText}>Resend code in {timer}s</p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    style={styles.linkButton}
                                >
                                    Resend Code
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsOtpSent(false)}
                                style={styles.linkButton}
                            >
                                Change Email
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    },
    header: { textAlign: 'center', marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '800', color: '#1a202c', marginBottom: '8px' },
    subtitle: { fontSize: '15px', color: '#718096', lineHeight: '1.5' },
    form: { display: 'flex', flexDirection: 'column', gap: '24px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#4a5568', marginLeft: '4px' },
    input: {
        padding: '14px 18px',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        fontSize: '16px',
        transition: 'all 0.2s',
        outline: 'none',
    },
    otpGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' },
    otpInput: {
        width: '100%',
        height: '56px',
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '700',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        background: '#f8fafc',
        outline: 'none',
        transition: 'all 0.2s',
    },
    primaryButton: {
        padding: '16px',
        borderRadius: '12px',
        border: 'none',
        background: '#4f46e5',
        color: 'white',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'transform 0.2s, background 0.2s',
        boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)',
    },
    footer: { display: 'flex', justifyContent: 'space-between', marginTop: '8px' },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#4f46e5',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        padding: '4px 8px',
    },
    timerText: { fontSize: '14px', color: '#718096', fontWeight: '500' },
};

export default OtpLogin;
