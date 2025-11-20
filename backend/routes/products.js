import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySeller
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload, { handleUploadError } from '../middleware/upload.js';
import { logFileUpload } from '../middleware/securityLogger.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/seller/:sellerId', getProductsBySeller);
router.get('/:id', getProductById);

// Protected routes (Seller/Admin only)
router.post(
  '/',
  protect,
  authorize('seller', 'admin'),
  upload.array('images', 5),
  handleUploadError,
  logFileUpload,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('seller', 'admin'),
  upload.array('images', 5),
  handleUploadError,
  logFileUpload,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('seller', 'admin'),
  deleteProduct
);

export default router;
