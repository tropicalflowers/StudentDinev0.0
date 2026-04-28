const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById } = require('../controllers/restaurantController');

// GET /api/restaurants
router.get('/', getRestaurants);

// GET /api/restaurants/:id
router.get('/:id', getRestaurantById);

module.exports = router;
