import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  becomeSeller
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { logAuthAttempt } from '../middleware/securityLogger.js';

const router = express.Router();

// Public routes with rate limiting and logging
router.post('/register', authLimiter, logAuthAttempt, register);
router.post('/login', authLimiter, logAuthAttempt, login);

// Protected routes
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/become-seller', protect, becomeSeller);

export default router;
