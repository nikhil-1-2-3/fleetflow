import { create } from 'zustand';
import api from '../services/api';

const useRentalStore = create((set) => ({
    records: [],
    loading: false,
    error: null,

    fetchRecords: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get('/rentals');
            set({ records: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    processCheckOut: async (checkoutData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/rentals/checkout', checkoutData);
            set((state) => ({ 
                records: [data, ...state.records], 
                loading: false 
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    },

    processCheckIn: async (id, checkinData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.put(`/rentals/checkin/${id}`, checkinData);
            set((state) => ({
                records: state.records.map(r => r._id === id ? data : r),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    }
}));

export default useRentalStore;
