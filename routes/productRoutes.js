const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// These are PROTECTED by the middleware
router.get('/', authMiddleware, productController.getAllProducts);
router.post('/', authMiddleware, productController.addProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);
router.put('/:id', authMiddleware, productController.updateProduct);


module.exports = router;