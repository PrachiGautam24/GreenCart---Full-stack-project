import Product from '../models/Product.js';
import { uploadImage } from '../utils/cloudinary.js';
import { sanitizeString, sanitizeObject } from '../utils/sanitize.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (Seller/Admin)
 */
const createProduct = async (req, res) => {
  try {
    let { title, description, price, sustainabilityTags, category, stock } = req.body;

    // Sanitize text inputs
    title = sanitizeString(title);
    description = sanitizeString(description);
    category = sanitizeString(category);

    // Parse sustainabilityTags if it's a string
    let parsedTags = sustainabilityTags;
    if (typeof sustainabilityTags === 'string') {
      parsedTags = JSON.parse(sustainabilityTags);
    }
    
    // Sanitize tags array
    if (Array.isArray(parsedTags)) {
      parsedTags = parsedTags.map(tag => sanitizeString(tag));
    }

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      // Save files temporarily and upload to Cloudinary
      for (const file of req.files) {
        const tempPath = path.join(__dirname, '../uploads', file.originalname);
        
        // Ensure uploads directory exists
        await fs.mkdir(path.join(__dirname, '../uploads'), { recursive: true });
        
        // Write buffer to temporary file
        await fs.writeFile(tempPath, file.buffer);
        
        // Upload to Cloudinary
        const imageUrl = await uploadImage(tempPath);
        imageUrls.push(imageUrl);
        
        // Delete temporary file
        await fs.unlink(tempPath);
      }
    }

    // Create product
    const product = await Product.create({
      title,
      description,
      price,
      images: imageUrls,
      sustainabilityTags: parsedTags,
      seller: req.user.id,
      category,
      stock: stock || 0
    });

    // Populate seller information
    await product.populate('seller', 'username email city');

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: 'PRODUCT_CREATE_ERROR'
      }
    });
  }
};

/**
 * @desc    Get all products with filtering and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const { search, tags, city, category, page = 1, limit = 20 } = req.query;
    // Debugging: log incoming tags param shape
    // (will be removed after diagnosing filter behavior)
    console.log('getProducts - tags param type:', typeof tags, 'value:', tags);

    // Build query
    let query = { isActive: true };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by sustainability tags (robust parsing)
    if (tags) {
      const parseTags = (raw) => {
        if (!raw) return [];
        if (Array.isArray(raw)) {
          return raw
            .flatMap((r) => (typeof r === 'string' ? r.split(/[\s,]+/) : []))
            .map((t) => t.trim())
            .filter(Boolean);
        }
        if (typeof raw === 'string') {
          // Accept comma separated, space separated or JSON array string
          try {
            const maybe = JSON.parse(raw);
            if (Array.isArray(maybe)) return maybe.map((t) => String(t).trim()).filter(Boolean);
          } catch (e) {
            // not JSON
          }
          return raw.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean);
        }
        // Fallback
        return [];
      };

      const tagArray = parseTags(tags);
      if (tagArray.length > 0) {
        // Build regex array for case-insensitive exact match
        const regexArray = tagArray.map((t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));

        // Support both array-of-tags and space-separated string in DB by matching either
        query.$or = [
          { sustainabilityTags: { $in: regexArray } },
          { sustainabilityTags: { $regex: tagArray.join('|'), $options: 'i' } },
        ];
      }
    }

    // Filter by category (case-insensitive, partial match)
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Filter by seller's city
    if (city) {
      // First find sellers in the specified city
      const { default: User } = await import('../models/User.js');
      const sellersInCity = await User.find({ 
        city: { $regex: city, $options: 'i' },
        role: { $in: ['seller', 'admin'] }
      }).select('_id');
      
      const sellerIds = sellersInCity.map(seller => seller._id);
      query.seller = { $in: sellerIds };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .populate('seller', 'username city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'PRODUCT_FETCH_ERROR'
      }
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'username email city profileImage createdAt');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'PRODUCT_FETCH_ERROR'
      }
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Seller/Admin - must own product)
 */
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        }
      });
    }

    // Check ownership (seller can only update their own products, admin can update any)
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to update this product',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const { title, description, price, sustainabilityTags, category, stock, isActive } = req.body;

    // Parse sustainabilityTags if it's a string
    let parsedTags = sustainabilityTags;
    if (typeof sustainabilityTags === 'string') {
      parsedTags = JSON.parse(sustainabilityTags);
    }

    // Handle new image uploads
    let imageUrls = [...product.images];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const tempPath = path.join(__dirname, '../uploads', file.originalname);
        
        await fs.mkdir(path.join(__dirname, '../uploads'), { recursive: true });
        await fs.writeFile(tempPath, file.buffer);
        
        const imageUrl = await uploadImage(tempPath);
        imageUrls.push(imageUrl);
        
        await fs.unlink(tempPath);
      }
    }

    // Update fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.images = imageUrls;
    product.sustainabilityTags = parsedTags || product.sustainabilityTags;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    await product.save();
    await product.populate('seller', 'username email city');

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: 'PRODUCT_UPDATE_ERROR'
      }
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Seller/Admin - must own product)
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        }
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to delete this product',
          code: 'UNAUTHORIZED'
        }
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'PRODUCT_DELETE_ERROR'
      }
    });
  }
};

/**
 * @desc    Get products by seller ID
 * @route   GET /api/products/seller/:sellerId
 * @access  Public
 */
const getProductsBySeller = async (req, res) => {
  try {
    const products = await Product.find({ 
      seller: req.params.sellerId,
      isActive: true 
    })
      .populate('seller', 'username city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        products: products
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'PRODUCT_FETCH_ERROR'
      }
    });
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySeller
};
