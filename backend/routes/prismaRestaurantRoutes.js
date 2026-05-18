const express = require('express');
const {
  getRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/prismaRestaurantController');

const router = express.Router();

console.log('PostgreSQL Restaurant CRUD active — routes mounted at /api/prisma/restaurants');

router.get('/', getRestaurants);
router.post('/', addRestaurant);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

module.exports = router;
