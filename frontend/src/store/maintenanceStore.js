import { create } from 'zustand';
import api from '../services/api';

const useMaintenanceStore = create((set) => ({
    records: [],
    loading: false,
    error: null,

    fetchRecords: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get('/maintenance');
            set({ records: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createRecord: async (recordData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/maintenance', recordData);
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

    updateRecord: async (id, recordData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.put(`/maintenance/${id}`, recordData);
            set((state) => ({
                records: state.records.map(r => r._id === id ? data : r),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    },

    deleteRecord: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/maintenance/${id}`);
            set((state) => ({
                records: state.records.filter(r => r._id !== id),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    },
}));

export default useMaintenanceStore;
