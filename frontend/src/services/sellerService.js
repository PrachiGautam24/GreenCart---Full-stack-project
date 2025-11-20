import api from './api';

const sellerService = {
  // Get seller profile with statistics
  getSellerProfile: async (sellerId) => {
    const response = await api.get(`/sellers/${sellerId}`);
    return response.data;
  },

  // Get seller's active products
  getSellerProducts: async (sellerId) => {
    const response = await api.get(`/sellers/${sellerId}/products`);
    return response.data;
  },

  // Get seller's reviews
  getSellerReviews: async (sellerId) => {
    const response = await api.get(`/sellers/${sellerId}/reviews`);
    return response.data;
  },
};

export default sellerService;
