import api from './api';

const productService = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }
    
    if (filters.city) {
      params.append('city', filters.city);
    }
    
    if (filters.page) {
      params.append('page', filters.page);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await api.get(url);
    return response.data;
  },

  // Get single product by ID
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Get products by seller
  getProductsBySeller: async (sellerId) => {
    const response = await api.get(`/products/seller/${sellerId}`);
    return response.data;
  },

  // Create new product (seller/admin only)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product (seller/admin only)
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product (seller/admin only)
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};

export default productService;
