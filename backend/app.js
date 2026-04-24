const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const messRoutes = require('./routes/messRoutes');
const managerRoutes = require('./routes/managerRoutes');

const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────────────
// Allow frontend (localhost:8000) to talk to backend (localhost:3000)
app.use(cors({
  origin: 'http://localhost:8000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Parse incoming JSON requests
app.use(express.json());

// Logger Middleware
app.use(loggerMiddleware);

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/menu',    menuRoutes);
app.use('/api/orders',  orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/mess',    messRoutes);
app.use('/api/manager', managerRoutes);


// ── Health check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Student Dine API is running!' });
});

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

module.exports = app;
