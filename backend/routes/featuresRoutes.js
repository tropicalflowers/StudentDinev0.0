const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  createSubscription,
  cancelSubscription,
  getReservations,
  createReservation,
  cancelReservation,
  getWallet,
  addMoneyToWallet,
  getTransactions,
} = require('../controllers/featuresController');

// ── Subscriptions ──
router.get('/subscriptions', getSubscriptions);
router.post('/subscriptions', createSubscription);
router.delete('/subscriptions/:id', cancelSubscription);

// ── Reservations ──
router.get('/reservations', getReservations);
router.post('/reservations', createReservation);
router.delete('/reservations/:id', cancelReservation);

// ── Wallet ──
router.get('/wallet', getWallet);
router.post('/wallet/add-money', addMoneyToWallet);
router.get('/wallet/transactions', getTransactions);

module.exports = router;
