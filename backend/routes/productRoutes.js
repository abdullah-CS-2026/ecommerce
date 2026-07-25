const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// Public routes
router.get("/productlist", productController.getProductList);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 10), productController.createProduct);

router.put('/:id', protect, adminOnly, upload.array('images', 10), productController.updateProduct);

router.delete('/:id', protect, adminOnly, productController.deleteProduct);

module.exports = router;