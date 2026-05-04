require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');


const promoteUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Successfully promoted ${email} to admin!`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email: node promote.js user@example.com');
  process.exit(1);
}

promoteUser(email);
