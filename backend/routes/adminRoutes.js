const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Product = require("../models/Product");
const Order = require("../models/Order");

router.get('/orders', protect, adminOnly, adminController.getAllOrders);
// Products
router.get("/products", protect, adminOnly, adminController.getProducts);

module.exports = router;
