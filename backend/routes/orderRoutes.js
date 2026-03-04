const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, placeOrder } = require('../controllers/orderController');

// GET  /api/orders          → get all orders (supports ?userId=1)
router.get('/', getAllOrders);

// GET  /api/orders/:id      → get one order
router.get('/:id', getOrderById);

// POST /api/orders          → place a new order
router.post('/', placeOrder);

module.exports = router;
