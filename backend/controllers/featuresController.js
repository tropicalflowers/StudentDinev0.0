const Subscription = require('../models/Subscription');
const Reservation = require('../models/Reservation');
const Wallet = require('../models/Wallet');

// ────────────────────────────────────────
// SUBSCRIPTIONS
// ────────────────────────────────────────

async function getSubscriptions(req, res) {
  try {
    const userId = req.query.userId;
    const query = userId ? { userId } : {};
    const subscriptions = await Subscription.find(query).sort({ startDate: -1 });
    res.json({ success: true, subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscriptions' });
  }
}

async function createSubscription(req, res) {
  try {
    const { userId, userName, plan, startDate } = req.body;

    if (!userId || !plan || !startDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Plan pricing and details
    const planDetails = {
      daily: { price: 150, meals: 1, days: 1 },
      weekly: { price: 800, meals: 7, days: 7 },
      monthly: { price: 3000, meals: 30, days: 30 },
      semester: { price: 12000, meals: 120, days: 120 },
    };

    const details = planDetails[plan];
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + details.days);

    const subscription = await Subscription.create({
      subscriptionId: 'SUB' + Date.now(),
      userId,
      userName,
      plan,
      startDate: start,
      endDate: end,
      price: details.price,
      meals: details.meals,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: `${plan} subscription created successfully`,
      subscription,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to create subscription' });
  }
}

async function cancelSubscription(req, res) {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { subscriptionId: req.params.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    res.json({ success: true, message: 'Subscription cancelled', subscription });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel subscription' });
  }
}

// ────────────────────────────────────────
// RESERVATIONS
// ────────────────────────────────────────

async function getReservations(req, res) {
  try {
    const userId = req.query.userId;
    const query = userId ? { userId } : {};
    const reservations = await Reservation.find(query).sort({ date: -1 });
    res.json({ success: true, reservations });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reservations' });
  }
}

async function createReservation(req, res) {
  try {
    const { userId, userName, restaurant, date, time, guests, specialRequests } = req.body;

    if (!userId || !restaurant || !date || !time || !guests) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const reservation = await Reservation.create({
      reservationId: 'RES' + Date.now(),
      userId,
      userName,
      restaurant,
      date,
      time,
      guests,
      specialRequests: specialRequests || '',
      status: 'confirmed',
    });

    res.status(201).json({
      success: true,
      message: 'Table reserved successfully',
      reservation,
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create reservation' });
  }
}

async function cancelReservation(req, res) {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { reservationId: req.params.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({ success: true, message: 'Reservation cancelled', reservation });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel reservation' });
  }
}

// ────────────────────────────────────────
// WALLET
// ────────────────────────────────────────

async function getWallet(req, res) {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    let wallet = await Wallet.findOne({ userId });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await Wallet.create({
        walletId: 'WALLET' + Date.now(),
        userId,
        userName: req.query.userName || 'User',
        balance: 500,
      });
    }

    res.json({ success: true, wallet });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wallet' });
  }
}

async function addMoneyToWallet(req, res) {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount < 100) {
      return res.status(400).json({ success: false, message: 'Invalid amount (minimum ₹100)' });
    }

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({
        walletId: 'WALLET' + Date.now(),
        userId,
        balance: 500,
      });
    }

    // Add transaction
    const transaction = {
      transactionId: 'TXN' + Date.now(),
      type: 'credit',
      amount,
      description: 'Add funds via UPI/Card',
      date: new Date(),
    };

    wallet.transactions.push(transaction);
    wallet.balance += amount;
    wallet.totalEarned += amount;

    await wallet.save();

    res.json({
      success: true,
      message: `₹${amount} added to wallet`,
      wallet,
    });
  } catch (error) {
    console.error('Add money error:', error);
    res.status(500).json({ success: false, message: 'Failed to add funds' });
  }
}

async function getTransactions(req, res) {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    res.json({ success: true, transactions: wallet.transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
}

module.exports = {
  // Subscriptions
  getSubscriptions,
  createSubscription,
  cancelSubscription,
  // Reservations
  getReservations,
  createReservation,
  cancelReservation,
  // Wallet
  getWallet,
  addMoneyToWallet,
  getTransactions,
};
