import User from '../models/User.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';

/**
 * @desc    Get seller profile with statistics
 * @route   GET /api/sellers/:id
 * @access  Public
 */
const getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select('-password');

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Seller not found',
          code: 'SELLER_NOT_FOUND'
        }
      });
    }

    // Check if user is a seller or admin
    if (seller.role !== 'seller' && seller.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'User is not a seller',
          code: 'NOT_A_SELLER'
        }
      });
    }

    // Get product count
    const productCount = await Product.countDocuments({ 
      seller: req.params.id,
      isActive: true 
    });

    // Calculate average rating from reviews
    const reviewStats = await Review.aggregate([
      { $match: { seller: seller._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const stats = reviewStats.length > 0 ? reviewStats[0] : { averageRating: 0, totalReviews: 0 };

    res.status(200).json({
      success: true,
      data: {
        _id: seller._id,
        username: seller.username,
        city: seller.city,
        profileImage: seller.profileImage,
        createdAt: seller.createdAt,
        productCount,
        averageRating: stats.averageRating ? parseFloat(stats.averageRating.toFixed(2)) : 0,
        totalReviews: stats.totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'SELLER_PROFILE_FETCH_ERROR'
      }
    });
  }
};

/**
 * @desc    Get seller's active products
 * @route   GET /api/sellers/:id/products
 * @access  Public
 */
const getSellerProducts = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Seller not found',
          code: 'SELLER_NOT_FOUND'
        }
      });
    }

    // Check if user is a seller or admin
    if (seller.role !== 'seller' && seller.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'User is not a seller',
          code: 'NOT_A_SELLER'
        }
      });
    }

    const products = await Product.find({ 
      seller: req.params.id,
      isActive: true 
    })
      .populate('seller', 'username city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'SELLER_PRODUCTS_FETCH_ERROR'
      }
    });
  }
};

/**
 * @desc    Get seller's reviews with average rating
 * @route   GET /api/sellers/:id/reviews
 * @access  Public
 */
const getSellerReviews = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Seller not found',
          code: 'SELLER_NOT_FOUND'
        }
      });
    }

    // Check if user is a seller or admin
    if (seller.role !== 'seller' && seller.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'User is not a seller',
          code: 'NOT_A_SELLER'
        }
      });
    }

    // Get reviews for this seller
    const reviews = await Review.find({ 
      seller: req.params.id,
      isApproved: true 
    })
      .populate('buyer', 'username profileImage')
      .populate('product', 'title images')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const reviewStats = await Review.aggregate([
      { $match: { seller: seller._id, isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const stats = reviewStats.length > 0 ? reviewStats[0] : { averageRating: 0, totalReviews: 0 };

    res.status(200).json({
      success: true,
      data: {
        reviews,
        averageRating: stats.averageRating ? parseFloat(stats.averageRating.toFixed(2)) : 0,
        totalReviews: stats.totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'SELLER_REVIEWS_FETCH_ERROR'
      }
    });
  }
};

export {
  getSellerProfile,
  getSellerProducts,
  getSellerReviews
};
