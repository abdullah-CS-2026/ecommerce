const User = require('../models/User');
const Address = require('../models/Address');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otpCode -otpExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, profilePicture } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

// Get user orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'name mainImage')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get user addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error: error.message });
  }
};

// Add new address
exports.addAddress = async (req, res) => {
  try {
    const { fullName, phone, email, street, city, state, postalCode, country, isDefault, addressType } = req.body;

    // If this is default, remove default from other addresses
    if (isDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const address = new Address({
      userId: req.user._id,
      fullName,
      phone,
      email,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
      addressType
    });

    await address.save();
    res.status(201).json({ message: 'Address added successfully', address });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, email, street, city, state, postalCode, country, isDefault, addressType } = req.body;

    const address = await Address.findOne({ _id: addressId, userId: req.user._id });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this is default, remove default from other addresses
    if (isDefault) {
      await Address.updateMany({ userId: req.user._id, _id: { $ne: addressId } }, { isDefault: false });
    }

    if (fullName) address.fullName = fullName;
    if (phone) address.phone = phone;
    if (email) address.email = email;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (country) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;
    if (addressType) address.addressType = addressType;

    await address.save();
    res.json({ message: 'Address updated successfully', address });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOneAndDelete({ _id: addressId, userId: req.user._id });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate('products.productId', 'name mainImage discountPrice');
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, products: [] });
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, products: [] });
    }

    const exists = wishlist.products.some(p => p.productId.toString() === productId);
    if (exists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.products.push({ productId });
    await wishlist.save();
    await wishlist.populate('products.productId', 'name mainImage discountPrice');

    res.json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(p => p.productId.toString() !== productId);
    await wishlist.save();

    res.json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};
