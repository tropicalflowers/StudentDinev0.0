const express = require('express');
const router = express.Router();
const { getAllCoupons, validateCoupon } = require('../controllers/couponController');

// GET  /api/coupons           → get all active coupons
router.get('/', getAllCoupons);

// POST /api/coupons/validate  → check if a coupon is valid
router.post('/validate', validateCoupon);

module.exports = router;
