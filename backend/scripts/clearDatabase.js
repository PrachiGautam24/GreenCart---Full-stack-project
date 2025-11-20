import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing database...');
    
    // Delete all documents from each collection
    const userResult = await User.deleteMany({});
    const productResult = await Product.deleteMany({});
    const orderResult = await Order.deleteMany({});
    const reviewResult = await Review.deleteMany({});

    console.log('\n=== Database Cleared ===');
    console.log(`Users deleted: ${userResult.deletedCount}`);
    console.log(`Products deleted: ${productResult.deletedCount}`);
    console.log(`Orders deleted: ${orderResult.deletedCount}`);
    console.log(`Reviews deleted: ${reviewResult.deletedCount}`);
    console.log('========================\n');

    console.log('Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
