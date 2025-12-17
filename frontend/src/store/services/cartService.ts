import api from './api';

export interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export const cartService = {
  async getCart(): Promise<{ success: boolean; data: Cart }> {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(productId: string, quantity: number = 1): Promise<{ success: boolean; data: Cart }> {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  async updateCartItem(productId: string, quantity: number): Promise<{ success: boolean; data: Cart }> {
    const response = await api.put('/cart/update', { productId, quantity });
    return response.data;
  },

  async removeFromCart(productId: string): Promise<{ success: boolean; data: Cart }> {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  async clearCart(): Promise<{ success: boolean }> {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};
