import { create } from 'zustand';
import api from '../services/api';

const useBookingStore = create((set) => ({
    bookings: [],
    myBookings: [],
    loading: false,
    error: null,

    fetchMyBookings: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get('/bookings/mybookings');
            set({ myBookings: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchAllBookings: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get('/bookings');
            set({ bookings: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createBooking: async (bookingData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/bookings', bookingData);
            set({ loading: false });
            return { success: true, data };
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    updateBookingStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
            await api.put(`/bookings/${id}/status`, { status });
            set((state) => ({
                bookings: state.bookings.map(b => b._id === id ? { ...b, status } : b),
                loading: false
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    clearError: () => set({ error: null })
}));

export default useBookingStore;
