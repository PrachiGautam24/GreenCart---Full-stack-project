import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteProduct,
  deleteReview
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/securityLogger.js';

const router = express.Router();

// All routes are admin-only and protected
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', logAdminAction('UPDATE_USER_ROLE'), updateUserRole);
router.put('/users/:id/status', logAdminAction('TOGGLE_USER_STATUS'), toggleUserStatus);

// Content moderation routes
router.delete('/products/:id', logAdminAction('DELETE_PRODUCT'), deleteProduct);
router.delete('/reviews/:id', logAdminAction('DELETE_REVIEW'), deleteReview);

export default router;
