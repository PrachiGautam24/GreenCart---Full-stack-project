import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Create order from cart (checkout)
export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with cart
    const user = await User.findById(userId).populate('cart.product');
    
    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ success: false, error: { message: 'Cart is empty' } });
    }

    // Prepare order items and calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      
      if (!product) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'One or more products in cart no longer exist' } 
        });
      }

      if (!product.isActive) {
        return res.status(400).json({ 
          success: false, 
          error: { message: `Product "${product.title}" is no longer available` } 
        });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: { message: `Insufficient stock for product "${product.title}"` } 
        });
      }

      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: cartItem.quantity,
        price: product.price,
        seller: product.seller
      });
    }

    // Mock payment gateway simulation (always succeeds)
    const paymentSuccess = true;

    if (!paymentSuccess) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Payment failed' } 
      });
    }

    // Create order
    const order = await Order.create({
      buyer: userId,
      items: orderItems,
      totalAmount,
      status: 'completed',
      paymentStatus: 'completed',
      paymentMethod: 'mock'
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    user.cart = [];
    await user.save();

    // Populate order details for response
    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'username email')
      .populate('items.product', 'title images')
      .populate('items.seller', 'username city');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Server error during checkout' } 
    });
  }
};

// Get user's order history
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ buyer: userId })
      .populate('items.product', 'title images price')
      .populate('items.seller', 'username city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Server error fetching orders' } 
    });
  }
};

// Get single order details
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id)
      .populate('buyer', 'username email city')
      .populate('items.product', 'title description images price')
      .populate('items.seller', 'username city');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Order not found' } 
      });
    }

    // Verify ownership (buyer can see their order, admin can see all)
    if (order.buyer._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Not authorized to view this order' } 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Server error fetching order' } 
    });
  }
};
