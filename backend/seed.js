require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const mockProducts = [
  {
    title: 'Wireless Noise-Canceling Headphones',
    description: 'Experience industry-leading noise cancellation with these premium over-ear headphones. Features 30-hour battery life.',
    originalPrice: 299.99,
    discountPrice: 249.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    rating: 4.8,
    reviewsCount: 124,
    variants: ['Black', 'Silver'],
    specifications: ['Bluetooth 5.0', 'Active Noise Cancellation', '30 hours battery']
  },
  {
    title: '4K Ultra HD Smart TV 55"',
    description: 'Immersive viewing experience with stunning 4K UHD resolution, vibrant colors, and smart TV capabilities.',
    originalPrice: 899.00,
    discountPrice: 699.00,
    category: 'TV',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
    rating: 4.6,
    reviewsCount: 89,
    variants: ['55 Inch', '65 Inch'],
    specifications: ['4K UHD Resolution', 'HDR10', 'Smart TV functionality']
  },
  {
    title: 'Smartphone Pro Max 256GB',
    description: 'The ultimate smartphone featuring a pro-grade camera system, all-day battery life, and lightning-fast performance.',
    originalPrice: 1099.00,
    discountPrice: 999.00,
    category: 'Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    rating: 4.9,
    reviewsCount: 432,
    variants: ['Midnight Black', 'Ocean Blue', 'Pearl White'],
    specifications: ['256GB Storage', '6.7 inch OLED display', 'A16 Bionic Chip']
  },
  {
    title: 'Mechanical Gaming Keyboard',
    description: 'Enhance your gaming performance with tactile mechanical switches, customizable RGB backlighting, and a durable aluminum frame.',
    originalPrice: 149.00,
    discountPrice: 119.00,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
    rating: 4.7,
    reviewsCount: 56,
    variants: ['Red Switches', 'Blue Switches', 'Brown Switches'],
    specifications: ['Mechanical Switches', 'RGB Backlighting', 'Full-size layout']
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    
    // Clear existing
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Insert new
    await Product.insertMany(mockProducts);
    console.log('Successfully inserted mock products.');

    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
  });
