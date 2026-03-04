const { readData } = require('../helpers/fileHelper');

// GET /api/coupons
function getAllCoupons(req, res) {
  const coupons = readData('coupons.json');
  const activeCoupons = coupons.filter(c => c.active);
  res.json({ success: true, count: activeCoupons.length, coupons: activeCoupons });
}

// POST /api/coupons/validate
function validateCoupon(req, res) {
  const { code, totalAmount } = req.body;

  if (!code || !totalAmount) {
    return res.status(400).json({ success: false, message: 'code and totalAmount are required' });
  }

  const coupons = readData('coupons.json');
  const coupon = coupons.find(c => c.code === code.toUpperCase());

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid coupon code' });
  }

  if (!coupon.active) {
    return res.status(400).json({ success: false, message: 'Coupon has expired' });
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
  }

  if (totalAmount < coupon.minOrder) {
    return res.status(400).json({
      success: false,
      message: `Minimum order ₹${coupon.minOrder} required for this coupon`
    });
  }

  // Calculate discount
  let discount = coupon.discount;
  if (coupon.discountType === 'percent') {
    discount = Math.floor((totalAmount * coupon.discount) / 100);
  }

  const finalAmount = Math.max(0, totalAmount - discount);

  res.json({
    success: true,
    message: 'Coupon applied!',
    discount,
    finalAmount,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discount: coupon.discount,
    }
  });
}

module.exports = { getAllCoupons, validateCoupon };
