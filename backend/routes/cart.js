import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', getCart);

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', addToCart);

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/update/:itemId', updateCartItem);

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', removeFromCart);

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', clearCart);

export default router;
