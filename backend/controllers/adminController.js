import User from '../models/User.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';

/**
 * Log admin action to console
 * In production, this should write to a proper logging system
 */
const logAdminAction = (adminId, action, details) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    adminId,
    action,
    details
  };
  console.log('[ADMIN ACTION]', JSON.stringify(logEntry));
};

/**
 * @desc    Get all users with role information
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    logAdminAction(req.user._id, 'GET_ALL_USERS', {
      userCount: users.length
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        count: users.length
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error fetching users',
        code: 'FETCH_USERS_ERROR'
      }
    });
  }
};

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || !['buyer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid role. Must be buyer, seller, or admin',
          code: 'INVALID_ROLE'
        }
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot change your own role',
          code: 'CANNOT_CHANGE_OWN_ROLE'
        }
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    logAdminAction(req.user._id, 'UPDATE_USER_ROLE', {
      userId: id,
      oldRole,
      newRole: role
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          city: user.city
        }
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error updating user role',
        code: 'UPDATE_ROLE_ERROR'
      }
    });
  }
};

/**
 * @desc    Activate or deactivate user account
 * @route   PUT /api/admin/users/:id/status
 * @access  Private/Admin
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'isActive must be a boolean value',
          code: 'INVALID_STATUS'
        }
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Prevent admin from deactivating their own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot change your own account status',
          code: 'CANNOT_CHANGE_OWN_STATUS'
        }
      });
    }

    // Add isActive field to user model if it doesn't exist
    user.isActive = isActive;
    await user.save();

    logAdminAction(req.user._id, 'TOGGLE_USER_STATUS', {
      userId: id,
      isActive
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error updating user status',
        code: 'UPDATE_STATUS_ERROR'
      }
    });
  }
};

/**
 * @desc    Delete any product
 * @route   DELETE /api/admin/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        }
      });
    }

    await Product.findByIdAndDelete(id);

    logAdminAction(req.user._id, 'DELETE_PRODUCT', {
      productId: id,
      productTitle: product.title,
      sellerId: product.seller
    });

    res.status(200).json({
      success: true,
      data: {
        message: 'Product deleted successfully'
      }
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error deleting product',
        code: 'DELETE_PRODUCT_ERROR'
      }
    });
  }
};

/**
 * @desc    Delete any review
 * @route   DELETE /api/admin/reviews/:id
 * @access  Private/Admin
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Review not found',
          code: 'REVIEW_NOT_FOUND'
        }
      });
    }

    // Store review details before deletion for logging
    const reviewDetails = {
      reviewId: id,
      productId: review.product,
      buyerId: review.buyer,
      rating: review.rating
    };

    // Update product rating before deleting review
    const product = await Product.findById(review.product);
    if (product && product.reviewCount > 0) {
      const totalRating = product.averageRating * product.reviewCount;
      const newTotalRating = totalRating - review.rating;
      const newReviewCount = product.reviewCount - 1;
      
      product.reviewCount = newReviewCount;
      product.averageRating = newReviewCount > 0 ? newTotalRating / newReviewCount : 0;
      await product.save();
    }

    await Review.findByIdAndDelete(id);

    logAdminAction(req.user._id, 'DELETE_REVIEW', reviewDetails);

    res.status(200).json({
      success: true,
      data: {
        message: 'Review deleted successfully'
      }
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error deleting review',
        code: 'DELETE_REVIEW_ERROR'
      }
    });
  }
};
