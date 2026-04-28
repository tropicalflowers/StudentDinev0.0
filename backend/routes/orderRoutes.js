const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, placeOrder, updateOrderStatus } = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

// GET  /api/orders          → get all orders (authenticated: get user's orders)
router.get('/', authMiddleware, getAllOrders);

// GET  /api/orders/:id      → get one order
router.get('/:id', authMiddleware, getOrderById);

// POST /api/orders          → place a new order
router.post('/', authMiddleware, placeOrder);

// PUT  /api/orders/:id      → update order status (manager only)
router.put('/:id', authMiddleware, updateOrderStatus);

module.exports = router;
