import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Important for sending/receiving cookies (JWT)
});

// Response interceptor for generic error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        return Promise.reject(new Error(message));
    }
);

export default api;
