const express = require('express');
const router = express.Router();
const { register, login, getProfile, refreshToken } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// Protected routes (require authentication)
// GET /api/auth/me - Get current user profile
router.get('/me', authMiddleware, getProfile);

// POST /api/auth/refresh - Refresh JWT token
router.post('/refresh', authMiddleware, refreshToken);

module.exports = router;
