const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Profile routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.post('/change-password', protect, userController.changePassword);

// Order routes
router.get('/orders', protect, userController.getOrders);

// Address routes
router.get('/addresses', protect, userController.getAddresses);
router.post('/addresses', protect, userController.addAddress);
router.put('/addresses/:addressId', protect, userController.updateAddress);
router.delete('/addresses/:addressId', protect, userController.deleteAddress);

// Wishlist routes
router.get('/wishlist', protect, userController.getWishlist);
router.post('/wishlist', protect, userController.addToWishlist);
router.delete('/wishlist/:productId', protect, userController.removeFromWishlist);

module.exports = router;
