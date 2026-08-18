import { create } from 'zustand';
import api from '../services/api';

const useReviewStore = create((set) => ({
    reviews: [],
    loading: false,
    error: null,

    fetchVehicleReviews: async (vehicleId) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get(`/reviews/vehicle/${vehicleId}`);
            set({ reviews: data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
        }
    },

    createReview: async (reviewData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/reviews', reviewData);
            set((state) => ({
                reviews: [data, ...state.reviews],
                loading: false
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },
    
    clearReviews: () => set({ reviews: [], error: null })
}));

export default useReviewStore;
