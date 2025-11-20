import express from 'express';
import {
  getSellerProfile,
  getSellerProducts,
  getSellerReviews
} from '../controllers/sellerController.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/:id', getSellerProfile);
router.get('/:id/products', getSellerProducts);
router.get('/:id/reviews', getSellerReviews);

export default router;
