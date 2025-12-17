import api from './api';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sustainabilityTags: string[];
  stock: number;
  images: string[];
  seller: {
    _id: string;
    username: string;
    city: string;
  };
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };
}

export const productService = {
  async getProducts(params?: {
    search?: string;
    category?: string;
    tags?: string[];
    city?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProductById(id: string): Promise<{ success: boolean; data: Product }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(formData: FormData): Promise<{ success: boolean; data: Product }> {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateProduct(id: string, formData: FormData): Promise<{ success: boolean; data: Product }> {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
