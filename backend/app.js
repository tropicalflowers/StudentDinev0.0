/**
 * Student Dine Backend - Express App Configuration
 * 
 * MIDDLEWARE PIPELINE ORDER (Request → Response):
 * 
 * 1. CORS Middleware
 *    - Validates origin (localhost:8000, localhost:3001)
 *    - Allows frontend to communicate with backend
 * 
 * 2. Body Parser (express.json)
 *    - Converts incoming JSON to req.body object
 * 
 * 3. Logger Middleware
 *    - Logs every request (method, path, timestamp)
 * 
 * 4. Static File Server (express.static)
 *    - Serves /uploads directory for images, videos, etc.
 * 
 * 5. Route Handlers
 *    - /api/auth → authRoutes → authController
 *    - /api/menu → menuRoutes → menuController
 *    - /api/prisma/staff → prismaStaffRoutes → prismaStaffController
 *    - Each route extracts parameters (:id) and passes to controller
 * 
 * 6. 404 Handler
 *    - Catches requests that don't match any route
 * 
 * 7. Global Error Handler (Last Middleware)
 *    - Catches all errors thrown in controllers/routes
 *    - Transforms them into appropriate HTTP responses
 * 
 * COMPLETE REQUEST FLOW EXAMPLE:
 * DELETE /api/prisma/staff/STAFF001
 *   ↓ CORS validation ✓
 *   ↓ Body parser (no body needed)
 *   ↓ Logger logs: DELETE /api/prisma/staff/STAFF001
 *   ↓ Route matching: /api/prisma/staff → prismaStaffRoutes
 *   ↓ Router: /:id → deleteStaff controller function
 *   ↓ Controller: await prisma.staff.delete({ where: { staffId: 'STAFF001' } })
 *   ↓ Response: { success: true, message: 'Staff deleted' }
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// ── MODULE IMPORTS (Clean Separation of Concerns) ──────────
// Routes are organized by feature, each handles its own CRUD operations
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const messRoutes = require('./routes/messRoutes');
const managerRoutes = require('./routes/managerRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const staffRoutes = require('./routes/staffRoutes');
const featuresRoutes = require('./routes/featuresRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const prismaRestaurantRoutes = require('./routes/prismaRestaurantRoutes');
const prismaStaffRoutes = require('./routes/prismaStaffRoutes');

// Middleware imports
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

// Uploaded files (read-only)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/upload', uploadRoutes);
app.use('/api/prisma/restaurants', prismaRestaurantRoutes);
app.use('/api/prisma/staff', prismaStaffRoutes);


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
