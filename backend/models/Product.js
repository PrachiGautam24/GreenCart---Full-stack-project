import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String
  }],
  sustainabilityTags: [{
    type: String,
    enum: {
      values: ['organic', 'handmade', 'recycled'],
      message: '{VALUE} is not a valid sustainability tag'
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required']
  },
  category: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
productSchema.index({ seller: 1 });
productSchema.index({ sustainabilityTags: 1 });
productSchema.index({ isActive: 1 });

export default mongoose.model('Product', productSchema);
