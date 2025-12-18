import express from 'express';
import { checkout, getOrders, getOrderById } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Checkout - create order from cart (buyer only)
router.post('/checkout', authorize('buyer'), checkout);

// Get user's order history
router.get('/', getOrders);

// Get single order details
router.get('/:id', getOrderById);

export default router;
