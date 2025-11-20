import api from './api';

const orderService = {
  // Create order from cart
  createOrder: async () => {
    const response = await api.post('/orders/checkout');
    return response.data;
  },

  // Get user's order history
  fetchOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get single order by ID
  fetchOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  }
};

export default orderService;
