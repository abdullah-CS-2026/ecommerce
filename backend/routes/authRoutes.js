const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// router.post('/register', authController.registerUser);
router.post('/register', (req, res) => {
  console.log("REGISTER ROUTE HIT");

  return res.json({
    success: true,
    message: "Route works"
  });
});
router.post('/login', authController.loginUser);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-otp', authController.resendOtp);
router.get('/profile', protect, authController.getUserProfile);
router.post('/logout', protect, authController.logout);

module.exports = router;
