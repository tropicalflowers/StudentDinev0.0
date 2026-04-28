const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, addRestaurant, updateRestaurant } = require('../controllers/restaurantController');

// GET /api/restaurants
router.get('/', getRestaurants);

// POST /api/restaurants
router.post('/', addRestaurant);

// GET /api/restaurants/:id
router.get('/:id', getRestaurantById);

// PUT /api/restaurants/:id
router.put('/:id', updateRestaurant);

module.exports = router;
