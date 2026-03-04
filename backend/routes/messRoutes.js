const express = require('express');
const router = express.Router();
const { getBookings, bookMess, cancelMess, groupBooking } = require('../controllers/messController');

router.get('/',         getBookings);    // GET  /api/mess?userId=2
router.post('/book',    bookMess);       // POST /api/mess/book
router.post('/cancel',  cancelMess);     // POST /api/mess/cancel
router.post('/group',   groupBooking);   // POST /api/mess/group

module.exports = router;
