import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axiosInstance.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            set({ user: data, token: data.token, isAuthenticated: true, isLoading: false });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Login failed',
                isLoading: false,
            });
            throw error;
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axiosInstance.post('/auth/register', userData);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            set({ user: data, token: data.token, isAuthenticated: true, isLoading: false });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Registration failed',
                isLoading: false,
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.get('/auth/me');
            // Merge with existing token since /me doesn't return token
            const token = localStorage.getItem('token');
            const updatedUser = { ...data, token };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error('Auth check failed:', error);
            // Don't logout automatically on simple check failure to avoid bad UX on network error
            // But if 401, maybe we should? For now, just stop loading.
            set({ isLoading: false });
            if (error.response?.status === 401) {
                set({ user: null, token: null, isAuthenticated: false });
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
