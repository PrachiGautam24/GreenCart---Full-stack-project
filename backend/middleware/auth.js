import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to verify JWT token and authenticate user
 * Extracts token from Authorization header and validates it
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          }
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);

      // Handle specific JWT errors
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Invalid token',
            code: 'INVALID_TOKEN'
          }
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Token expired',
            code: 'TOKEN_EXPIRED'
          }
        });
      }

      return res.status(401).json({
        success: false,
        error: {
          message: 'Not authorized to access this route',
          code: 'UNAUTHORIZED'
        }
      });
    }
  }

  // No token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'No token provided',
        code: 'NO_TOKEN'
      }
    });
  }
};

/**
 * Middleware to check if user has required role(s)
 * Must be used after protect middleware
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `User role '${req.user.role}' is not authorized to access this route`,
          code: 'FORBIDDEN'
        }
      });
    }

    next();
  };
};
