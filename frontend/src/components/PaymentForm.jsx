import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../components/ui/Button';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            // 1. Create Payment Intent on backend
            const { data } = await api.post('/payment/create-payment-intent', { amount });
            const clientSecret = data.clientSecret;

            // 2. Confirm payment on frontend
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                toast.error(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    onSuccess(result.paymentIntent.id);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border-2 border-slate-100 rounded-2xl bg-slate-50">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#0f172a',
                            '::placeholder': {
                                color: '#94a3b8',
                            },
                        },
                        invalid: {
                            color: '#e11d48',
                        },
                    },
                }} />
            </div>
            <div className="flex gap-4">
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                    Cancel
                </Button>
                <Button type="submit" disabled={!stripe || loading} isLoading={loading} className="flex-1">
                    Pay ${amount.toFixed(2)}
                </Button>
            </div>
        </form>
    );
};

export default PaymentForm;
