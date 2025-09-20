const express = require('express');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticate, authController.getProfile);
router.put('/me', authenticate, authController.updateProfile);
router.post('/logout', authenticate, authController.logout);

module.exports = router;