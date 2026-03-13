import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null; // Or a spinner

    return user && user.role === 'admin' ? children : <Navigate to="/login" />;
};

export default AdminRoute;
