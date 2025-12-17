import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();

// Sample user data for each role
const users = [
  {
    username: 'admin',
    email: 'admin@greencart.com',
    password: 'admin123',
    role: 'admin',
    city: 'New York',
    profileImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
  },
  {
    username: 'seller1',
    email: 'seller1@greencart.com',
    password: 'seller123',
    role: 'seller',
    city: 'San Francisco',
    profileImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
  },
  {
    username: 'seller2',
    email: 'seller2@greencart.com',
    password: 'seller123',
    role: 'seller',
    city: 'Los Angeles',
    profileImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
  },
  {
    username: 'buyer1',
    email: 'buyer1@greencart.com',
    password: 'buyer123',
    role: 'buyer',
    city: 'San Francisco',
    profileImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
  },
  {
    username: 'buyer2',
    email: 'buyer2@greencart.com',
    password: 'buyer123',
    role: 'buyer',
    city: 'Los Angeles',
    profileImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
  }
];

// Sample product data
const getProducts = (sellerIds) => [
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable 100% organic cotton t-shirt, sustainably sourced and ethically produced.',
    price: 29.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop'],
    sustainabilityTags: ['organic'],
    seller: sellerIds[0],
    category: 'Clothing',
    stock: 50,
    isActive: true
  },
  {
    title: 'Handmade Ceramic Mug',
    description: 'Beautiful handcrafted ceramic mug, perfect for your morning coffee or tea.',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80&auto=format&fit=crop'],
    sustainabilityTags: ['handmade'],
    seller: sellerIds[0],
    category: 'Home & Kitchen',
    stock: 30,
    isActive: true
  },
  {
    title: 'Recycled Plastic Backpack',
    description: 'Durable backpack made from 100% recycled plastic bottles. Eco-friendly and stylish.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop'],
    sustainabilityTags: ['recycled'],
    seller: sellerIds[0],
    category: 'Accessories',
    stock: 25,
    isActive: true
  },
  {
    title: 'Organic Honey',
    description: 'Pure organic honey from local beekeepers. No additives or preservatives.',
    price: 15.99,
    images: ['https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80&auto=format&fit=crop'],
    sustainabilityTags: ['organic'],
    seller: sellerIds[1],
    category: 'Food & Beverage',
    stock: 100,
    isActive: true
  },
  {
    title: 'Handmade Wooden Cutting Board',
    description: 'Artisan-crafted cutting board from sustainable wood sources.',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80&auto=format&fit=crop'],
    sustainabilityTags: ['handmade'],
    seller: sellerIds[1],
    category: 'Home & Kitchen',
    stock: 15,
    isActive: true
  },
  {
    title: 'Recycled Paper Notebook Set',
    description: 'Set of 3 notebooks made from 100% recycled paper. Perfect for journaling.',
    price: 18.99,
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80&auto=format&fit=crop'],
    sustainabilityTags: ['recycled'],
    seller: sellerIds[1],
    category: 'Stationery',
    stock: 60,
    isActive: true
  },
  {
    title: 'Organic Bamboo Toothbrush',
    description: 'Biodegradable bamboo toothbrush with soft bristles. Eco-friendly dental care.',
    price: 8.99,
    images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80&auto=format&fit=crop'],
    sustainabilityTags: ['organic'],
    seller: sellerIds[0],
    category: 'Personal Care',
    stock: 200,
    isActive: true
  },
  {
    title: 'Handmade Soy Candle',
    description: 'Hand-poured soy candle with natural essential oils. Burns clean and long.',
    price: 22.99,
    images: ['https://5.imimg.com/data5/SELLER/Default/2023/12/368986516/YS/WW/LZ/148092396/soy-wax-meditation-aromatherapy-candles-500x500.jpg'],
    sustainabilityTags: ['handmade', 'organic'],
    seller: sellerIds[1],
    category: 'Home & Decor',
    stock: 40,
    isActive: true
  }
];

// Sample order data
const getOrders = (buyerIds, productData) => [
  {
    buyer: buyerIds[0],
    items: [
      {
        product: productData[0]._id,
        quantity: 2,
        price: productData[0].price,
        seller: productData[0].seller
      },
      {
        product: productData[1]._id,
        quantity: 1,
        price: productData[1].price,
        seller: productData[1].seller
      }
    ],
    totalAmount: (productData[0].price * 2) + productData[1].price,
    status: 'completed',
    paymentStatus: 'completed',
    paymentMethod: 'mock'
  },
  {
    buyer: buyerIds[1],
    items: [
      {
        product: productData[3]._id,
        quantity: 3,
        price: productData[3].price,
        seller: productData[3].seller
      }
    ],
    totalAmount: productData[3].price * 3,
    status: 'completed',
    paymentStatus: 'completed',
    paymentMethod: 'mock'
  }
];

// Sample review data
const getReviews = (orderData, buyerIds, productData) => [
  {
    product: productData[0]._id,
    seller: productData[0].seller,
    buyer: buyerIds[0],
    order: orderData[0]._id,
    rating: 5,
    comment: 'Excellent quality! The organic cotton is so soft and comfortable.',
    isApproved: true
  },
  {
    product: productData[1]._id,
    seller: productData[1].seller,
    buyer: buyerIds[0],
    order: orderData[0]._id,
    rating: 4,
    comment: 'Beautiful craftsmanship. Love the design!',
    isApproved: true
  },
  {
    product: productData[3]._id,
    seller: productData[3].seller,
    buyer: buyerIds[1],
    order: orderData[1]._id,
    rating: 5,
    comment: 'Best honey I\'ve ever tasted. Will definitely buy again!',
    isApproved: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('Existing data cleared');

    // Create users (using create() to trigger password hashing middleware)
    console.log('Creating users...');
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Get seller and buyer IDs
    const sellerIds = createdUsers
      .filter(user => user.role === 'seller')
      .map(user => user._id);
    const buyerIds = createdUsers
      .filter(user => user.role === 'buyer')
      .map(user => user._id);

    // Create products
    console.log('Creating products...');
    const productData = getProducts(sellerIds);
    const createdProducts = await Product.insertMany(productData);
    console.log(`Created ${createdProducts.length} products`);

    // Create orders
    console.log('Creating orders...');
    const orderData = getOrders(buyerIds, createdProducts);
    const createdOrders = await Order.insertMany(orderData);
    console.log(`Created ${createdOrders.length} orders`);

    // Create reviews
    console.log('Creating reviews...');
    const reviewData = getReviews(createdOrders, buyerIds, createdProducts);
    const createdReviews = await Review.insertMany(reviewData);
    console.log(`Created ${createdReviews.length} reviews`);

    // Update product ratings based on reviews
    console.log('Updating product ratings...');
    for (const product of createdProducts) {
      const productReviews = createdReviews.filter(
        review => review.product.toString() === product._id.toString()
      );
      
      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / productReviews.length;
        
        await Product.findByIdAndUpdate(product._id, {
          averageRating: averageRating,
          reviewCount: productReviews.length
        });
      }
    }
    console.log('Product ratings updated');

    console.log('\n=== Seed Data Summary ===');
    console.log(`Users: ${createdUsers.length}`);
    console.log(`  - Admin: 1 (admin@greencart.com / admin123)`);
    console.log(`  - Sellers: 2 (seller1@greencart.com, seller2@greencart.com / seller123)`);
    console.log(`  - Buyers: 2 (buyer1@greencart.com, buyer2@greencart.com / buyer123)`);
    console.log(`Products: ${createdProducts.length}`);
    console.log(`Orders: ${createdOrders.length}`);
    console.log(`Reviews: ${createdReviews.length}`);
    console.log('========================\n');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
