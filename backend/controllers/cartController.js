import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'title price images stock isActive seller'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Filter out inactive products or products that no longer exist
    const validCartItems = user.cart.filter(
      item => item.product && item.product.isActive
    );

    // Calculate total
    const totalAmount = validCartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        items: validCartItems,
        totalAmount: totalAmount.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to retrieve cart',
        code: 'GET_CART_ERROR'
      }
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Product ID is required',
          code: 'PRODUCT_ID_REQUIRED'
        }
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Quantity must be at least 1',
          code: 'INVALID_QUANTITY'
        }
      });
    }

    // Check if product exists and is active
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

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Product is not available',
          code: 'PRODUCT_NOT_AVAILABLE'
        }
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Only ${product.stock} items available in stock`,
          code: 'INSUFFICIENT_STOCK'
        }
      });
    }

    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Check if product already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Cannot add more items. Only ${product.stock} available in stock`,
            code: 'INSUFFICIENT_STOCK'
          }
        });
      }

      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity
      });
    }

    await user.save();

    // Populate cart for response
    await user.populate({
      path: 'cart.product',
      select: 'title price images stock isActive seller'
    });

    // Calculate total
    const totalAmount = user.cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      message: 'Item added to cart',
      data: {
        items: user.cart,
        totalAmount: totalAmount.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to add item to cart',
        code: 'ADD_TO_CART_ERROR'
      }
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Quantity must be at least 1',
          code: 'INVALID_QUANTITY'
        }
      });
    }

    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Find cart item
    const cartItemIndex = user.cart.findIndex(
      item => item._id.toString() === itemId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Cart item not found',
          code: 'CART_ITEM_NOT_FOUND'
        }
      });
    }

    // Check product stock
    const product = await Product.findById(user.cart[cartItemIndex].product);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        }
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Only ${product.stock} items available in stock`,
          code: 'INSUFFICIENT_STOCK'
        }
      });
    }

    // Update quantity
    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    // Populate cart for response
    await user.populate({
      path: 'cart.product',
      select: 'title price images stock isActive seller'
    });

    // Calculate total
    const totalAmount = user.cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      message: 'Cart item updated',
      data: {
        items: user.cart,
        totalAmount: totalAmount.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update cart item',
        code: 'UPDATE_CART_ERROR'
      }
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Find and remove cart item
    const cartItemIndex = user.cart.findIndex(
      item => item._id.toString() === itemId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Cart item not found',
          code: 'CART_ITEM_NOT_FOUND'
        }
      });
    }

    user.cart.splice(cartItemIndex, 1);
    await user.save();

    // Populate cart for response
    await user.populate({
      path: 'cart.product',
      select: 'title price images stock isActive seller'
    });

    // Calculate total
    const totalAmount = user.cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        items: user.cart,
        totalAmount: totalAmount.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to remove item from cart',
        code: 'REMOVE_FROM_CART_ERROR'
      }
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Clear cart
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: {
        items: [],
        totalAmount: '0.00'
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to clear cart',
        code: 'CLEAR_CART_ERROR'
      }
    });
  }
};
