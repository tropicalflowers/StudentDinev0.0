const express = require('express');
const {
  getStaff,
  getStaffByRestaurant,
  addStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/prismaStaffController');

const router = express.Router();

console.log('✓ PostgreSQL Staff CRUD routes mounted at /api/prisma/staff');

// GET all staff
router.get('/', (req, res, next) => {
  console.log(`[Staff Route] GET / — Fetch all staff`);
  getStaff(req, res, next);
});

// POST new staff
router.post('/', (req, res, next) => {
  console.log(`[Staff Route] POST / — Create staff with data:`, req.body);
  addStaff(req, res, next);
});

// GET staff by restaurant
router.get('/restaurant/:restaurantId', (req, res, next) => {
  console.log(`[Staff Route] GET /restaurant/${req.params.restaurantId}`);
  getStaffByRestaurant(req, res, next);
});

// PUT update staff (param :staffId is the staff's unique ID like STAFF001)
router.put('/:staffId', (req, res, next) => {
  console.log(`[Staff Route] PUT /${req.params.staffId} — Update staff`, req.body);
  req.params.id = req.params.staffId; // Map staffId to id for controller compatibility
  updateStaff(req, res, next);
});

// DELETE staff
router.delete('/:staffId', (req, res, next) => {
  console.log(`[Staff Route] DELETE /${req.params.staffId}`);
  req.params.id = req.params.staffId; // Map staffId to id for controller compatibility
  deleteStaff(req, res, next);
});

module.exports = router;
