const express = require('express');
const router = express.Router();
const { getStats, getFeedback, submitFeedback } = require('../controllers/managerController');

router.get('/stats',    getStats);       // GET  /api/manager/stats
router.get('/feedback', getFeedback);    // GET  /api/manager/feedback
router.post('/feedback', submitFeedback); // POST /api/manager/feedback

module.exports = router;
