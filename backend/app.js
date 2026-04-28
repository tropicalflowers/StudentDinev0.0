const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const messRoutes = require('./routes/messRoutes');
const managerRoutes = require('./routes/managerRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const staffRoutes = require('./routes/staffRoutes');

const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────────────
// CORS configuration - Allow frontend to talk to backend
const allowedOrigins = [
  'http://localhost:8000',
  'http://localhost:3001',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:3001',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, allow any localhost origin
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/staff',   staffRoutes);


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
