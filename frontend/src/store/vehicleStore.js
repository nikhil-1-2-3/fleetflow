import { create } from 'zustand';
import api from '../services/api';

const useVehicleStore = create((set) => ({
    vehicles: [],
    vehicle: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,

    fetchVehicles: async (keyword = '', pageNumber = 1) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get(`/vehicles?keyword=${keyword}&pageNumber=${pageNumber}`);
            set({ vehicles: data.vehicles, page: data.page, pages: data.pages, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchVehicleDetails: async (id) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get(`/vehicles/${id}`);
            set({ vehicle: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createVehicle: async (vehicleData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/vehicles', vehicleData);
            set((state) => ({ 
                vehicles: [data, ...state.vehicles], 
                loading: false 
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    },

    updateVehicle: async (id, vehicleData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.put(`/vehicles/${id}`, vehicleData);
            set((state) => ({
                vehicles: state.vehicles.map(v => v._id === id ? data : v),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    },

    deleteVehicle: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/vehicles/${id}`);
            set((state) => ({
                vehicles: state.vehicles.filter(v => v._id !== id),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return false;
        }
    },

    clearVehicle: () => set({ vehicle: null }),
}));

export default useVehicleStore;
