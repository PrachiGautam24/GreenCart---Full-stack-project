import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc    Submit a review for a product
 * @route   POST /api/reviews
 * @access  Private (Buyer only)
 */
export const submitReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const buyerId = req.user.id;

    // Validate required fields
    if (!productId || !orderId || !rating) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Product ID, Order ID, and rating are required',
          code: 'MISSING_FIELDS'
        }
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Rating must be between 1 and 5',
          code: 'INVALID_RATING'
        }
      });
    }

    // Verify the order exists and belongs to the buyer
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Order not found',
          code: 'ORDER_NOT_FOUND'
        }
      });
    }

    if (order.buyer.toString() !== buyerId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to review this order',
          code: 'UNAUTHORIZED'
        }
      });
    }

    // Verify the product is in the order
    const orderItem = order.items.find(
      item => item.product.toString() === productId
    );

    if (!orderItem) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Product not found in this order',
          code: 'PRODUCT_NOT_IN_ORDER'
        }
      });
    }

    // Get product to find seller
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        }
      });
    }

    // Check if review already exists for this buyer-order-product combination
    const existingReview = await Review.findOne({
      buyer: buyerId,
      order: orderId,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'You have already reviewed this product from this order',
          code: 'REVIEW_EXISTS'
        }
      });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      seller: product.seller,
      buyer: buyerId,
      order: orderId,
      rating,
      comment: comment || ''
    });

    // Update product average rating and review count
    await updateProductRating(productId);

    // Populate review for response
    const populatedReview = await Review.findById(review._id)
      .populate('buyer', 'username profileImage')
      .populate('product', 'title images')
      .populate('seller', 'username');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    console.error('Submit review error:', error);

    // Handle duplicate key error (unique index violation)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'You have already reviewed this product from this order',
          code: 'REVIEW_EXISTS'
        }
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: messages.join(', '),
          code: 'VALIDATION_ERROR'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Error submitting review',
        code: 'REVIEW_SUBMIT_ERROR'
      }
    });
  }
};

/**
 * @desc    Get reviews for a specific product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ 
      product: productId,
      isApproved: true 
    })
      .populate('buyer', 'username profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error fetching product reviews',
        code: 'REVIEW_FETCH_ERROR'
      }
    });
  }
};

/**
 * @desc    Get reviews for a specific seller
 * @route   GET /api/reviews/seller/:sellerId
 * @access  Public
 */
export const getSellerReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const reviews = await Review.find({ 
      seller: sellerId,
      isApproved: true 
    })
      .populate('buyer', 'username profileImage')
      .populate('product', 'title images')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal
    });
  } catch (error) {
    console.error('Get seller reviews error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error fetching seller reviews',
        code: 'REVIEW_FETCH_ERROR'
      }
    });
  }
};

/**
 * Helper function to update product average rating and review count
 * @param {string} productId - Product ID to update
 */
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ 
      product: productId,
      isApproved: true 
    });

    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
    throw error;
  }
};
