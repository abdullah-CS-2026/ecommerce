require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({
      email: 'iamabdullah536@gmail.com'
    });

    if (existingAdmin) {
      console.log('⚠️ Admin already exists.');
      process.exit(0);
    }

    await User.create({
      name: 'Abdullah',
      email: 'iamabdullah536@gmail.com',
      password: 'Abdullah_123',
      role: 'admin',
      isEmailVerified: true
    });

    console.log('✅ Admin created successfully!');
    console.log('Email: iamabdullah536@gmail.com');
    console.log('Password: Abdullah_123');

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();