import { create } from 'zustand';
import api from '../services/api';

const useBranchStore = create((set) => ({
    branches: [],
    loading: false,
    error: null,

    fetchBranches: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get('/branches');
            set({ branches: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createBranch: async (branchData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/branches', branchData);
            set((state) => ({ 
                branches: [...state.branches, data], 
                loading: false 
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    },

    updateBranch: async (id, branchData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.put(`/branches/${id}`, branchData);
            set((state) => ({
                branches: state.branches.map(b => b._id === id ? data : b),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    },

    deleteBranch: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/branches/${id}`);
            set((state) => ({
                branches: state.branches.filter(b => b._id !== id),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    },
}));

export default useBranchStore;
