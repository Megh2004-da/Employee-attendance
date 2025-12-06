import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useAttendanceStore = create((set) => ({
    todayStatus: null,
    history: [],
    isLoading: false,
    error: null,

    getTodayStatus: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.get('/attendance/today');
            set({ todayStatus: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    checkIn: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.post('/attendance/checkin');
            set({ todayStatus: data, isLoading: false });
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Check-in failed', isLoading: false });
            throw error;
        }
    },

    checkOut: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.post('/attendance/checkout');
            set({ todayStatus: data, isLoading: false });
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Check-out failed', isLoading: false });
            throw error;
        }
    },

    getMyHistory: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.get('/attendance/my-history');
            set({ history: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
}));

export default useAttendanceStore;
