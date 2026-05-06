const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
} = require('../controllers/productController');

const verifyToken = (req, res, next) => next(); // TODO: replace with real middleware
const isAdmin    = (req, res, next) => next(); // TODO: replace with real middleware

// IMPORTANT: /admin/all must come before /:id — otherwise Express treats "admin" as an ID
router.get('/admin/all', verifyToken, isAdmin, getAllProductsAdmin);

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);
router.patch('/:id/stock', verifyToken, adjustStock);

module.exports = router;
