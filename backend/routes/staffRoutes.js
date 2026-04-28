const express = require('express');
const router = express.Router();
const { getStaff, getStaffById, getStaffByRestaurant } = require('../controllers/staffController');

// GET /api/staff
router.get('/', getStaff);

// GET /api/staff/:id
router.get('/:id', getStaffById);

// GET /api/staff/restaurant/:restaurant
router.get('/restaurant/:restaurant', getStaffByRestaurant);

module.exports = router;
