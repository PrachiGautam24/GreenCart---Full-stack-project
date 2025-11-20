import express from 'express';
import {
  submitReview,
  getProductReviews,
  getSellerReviews
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/seller/:sellerId', getSellerReviews);

// Protected routes (Buyer only)
router.post('/', protect, authorize('buyer'), submitReview);

export default router;
