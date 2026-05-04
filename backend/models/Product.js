const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Renamed from title
  description: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  
  // Pricing
  price: { type: Number, required: true, default: 0 }, // Base price before discounts
  originalPrice: { type: Number, required: true }, // For "was $X" display
  discountPrice: { type: Number, required: true }, // Current selling price
  discountPercentage: { type: Number, default: 0 },
  currency: { type: String, default: 'PKR' },

  // Inventory
  countInStock: { type: Number, required: true, default: 0 },

  // Identity & Status
  mainImage: { type: String, required: true }, // Renamed from imageUrl
  images: [{ type: String }], // Array of additional images
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: true },

  // Details
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  colors: [{ type: String }],
  sizes: [{ type: String }],

  // Logistics
  shippingCost: { type: Number, default: 0 },
  deliveryTime: { type: String, default: '3-5 business days' },

  // Social & Feedback
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

  // Admin Meta
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

module.exports = mongoose.model('Product', productSchema);
