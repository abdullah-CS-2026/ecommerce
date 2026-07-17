const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/orders', protect, adminOnly, adminController.getAllOrders);

module.exports = router;
