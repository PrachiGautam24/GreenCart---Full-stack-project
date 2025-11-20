import api from './api';

const reviewService = {
  // Submit a new review
  submitReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Get reviews for a specific product
  fetchProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  // Get reviews for a specific seller
  fetchSellerReviews: async (sellerId) => {
    const response = await api.get(`/reviews/seller/${sellerId}`);
    return response.data;
  },

  // Delete a review (admin only)
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};

export default reviewService;
