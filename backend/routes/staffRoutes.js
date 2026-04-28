const express = require('express');
const router = express.Router();
const { getStaff, getStaffById, getStaffByRestaurant, addStaff, updateStaff, deleteStaff } = require('../controllers/staffController');

// GET /api/staff
router.get('/', getStaff);

// POST /api/staff
router.post('/', addStaff);

// GET /api/staff/restaurant/:restaurant
router.get('/restaurant/:restaurant', getStaffByRestaurant);

// GET /api/staff/:id
router.get('/:id', getStaffById);

// PUT /api/staff/:id
router.put('/:id', updateStaff);

// DELETE /api/staff/:id
router.delete('/:id', deleteStaff);

module.exports = router;
