import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors (expired/invalid tokens)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
