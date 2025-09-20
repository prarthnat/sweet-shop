const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const sweetsController = require('../controllers/sweetsController');

const router = express.Router();

// Public routes
router.get('/', sweetsController.getAllSweets);
router.get('/search', sweetsController.searchSweets);
router.get('/:id', sweetsController.getSweet);

// Protected routes (require authentication)
router.post('/:id/purchase', authenticate, sweetsController.purchaseSweet);
router.get('/purchases/history', authenticate, sweetsController.getPurchaseHistory);

// Admin only routes
router.post('/', authenticate, requireAdmin, sweetsController.createSweet);
router.put('/:id', authenticate, requireAdmin, sweetsController.updateSweet);
router.delete('/:id', authenticate, requireAdmin, sweetsController.deleteSweet);
router.post('/:id/restock', authenticate, requireAdmin, sweetsController.restockSweet);
router.get('/:id/stats', authenticate, requireAdmin, sweetsController.getSweetStats);

module.exports = router;