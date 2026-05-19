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
const featuresRoutes = require('./routes/featuresRoutes');

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
  'https://studentdinev0-0.vercel.app',
  'https://studentdine.vercel.app',
  'https://studentdinee.onrender.com',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.FRONTEND_URL || null,
].filter(Boolean);

// Handle preflight OPTIONS requests explicitly
app.options('*', cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
}));

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
        // Log blocked origins for debugging
        console.log('CORS blocked origin:', origin);
        callback(null, true); // Allow all origins for now to debug
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
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
app.use('/api/features', featuresRoutes);


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
