import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
    user: JSON.parse(localStorage.getItem('userInfo')) || null,
    loading: false,
    error: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return { ...state, loading: true };
        case 'LOGIN_SUCCESS':
            return { ...state, loading: false, user: action.payload, error: null };
        case 'LOGIN_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        if (state.user) {
            localStorage.setItem('userInfo', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('userInfo');
        }
    }, [state.user]);

    const login = async (email, otp) => {
        dispatch({ type: 'LOGIN_REQUEST' });
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, { email, otp });
            dispatch({ type: 'LOGIN_SUCCESS', payload: data });
            return data;
        } catch (error) {
            dispatch({
                type: 'LOGIN_FAIL',
                payload: error.response?.data?.message || error.message
            });
            throw error;
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
