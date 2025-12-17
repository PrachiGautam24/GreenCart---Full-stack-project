import api from './api';

export interface Review {
  _id: string;
  buyer: {
    _id: string;
    username: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviewService = {
  async getProductReviews(productId: string): Promise<{ success: boolean; data: Review[] }> {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  async createReview(data: {
    productId: string;
    rating: number;
    comment: string;
  }): Promise<{ success: boolean; data: Review }> {
    const response = await api.post('/reviews', data);
    return response.data;
  },
};
