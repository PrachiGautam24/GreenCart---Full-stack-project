import api from './api';

// Get all users
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// Update user role
export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

// Toggle user status (activate/deactivate)
export const toggleUserStatus = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/status`);
  return response.data;
};

// Delete product
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data;
};

// Delete review
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/admin/reviews/${reviewId}`);
  return response.data;
};

const adminService = {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteProduct,
  deleteReview
};

export default adminService;
