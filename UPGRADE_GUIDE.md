# StudentDine v0.1 - Upgrade Guide

## What's New in This Release

This release brings significant improvements to the StudentDine portal with MongoDB integration, enterprise-grade security, real-time updates, and animated UI.

### ✨ Major Features Added

#### 1. **MongoDB Integration**
- Replaced JSON file-based storage with MongoDB
- Mongoose schemas for Users, MenuItems, Orders, and Coupons
- Automatic data validation and relationships

#### 2. **Secure Authentication**
- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication (7-day expiration)
- Login/Register with email or roll number
- Automatic session management on frontend

#### 3. **Middleware System**
- **Logger Middleware**: Logs all requests with timestamps and response times
- **Auth Middleware**: Verifies JWT tokens and extracts user information
- **Authorization Middleware**: Role-based access control (student, hosteller, manager)
- **Error Handler**: Centralized error handling with proper HTTP status codes

#### 4. **Real-time Order Tracking (Socket.io)**
- Live order status updates: Pending → Accepted → Cooking → Ready → Delivered
- Real-time notifications to customers when order status changes
- Manager dashboard receives instant notifications of new orders
- User rooms for targeted updates

#### 5. **Animated Landing Page**
- CSS-only animations (no JavaScript animation libraries)
- Fade-in effects on page load
- Floating header logo with glow effect
- Staggered card animations
- Gradient animations on buttons and cards
- Smooth transitions on all interactive elements

## Setup Instructions

### Prerequisites

- Node.js 14+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies** (already done if you ran `npm install mongoose bcryptjs jsonwebtoken socket.io dotenv`)
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Edit `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/studentdine
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   ```

   **For MongoDB Atlas**, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studentdine
   JWT_SECRET=your_secure_key
   ```

4. **Migrate existing data to MongoDB** (if using existing data)
   ```bash
   npm run migrate
   ```

   This script will:
   - Hash all passwords using bcrypt
   - Convert JSON data to MongoDB collections
   - Create indexes for better performance
   - Report migration statistics

5. **Start the backend server**
   ```bash
   npm start
   ```

   Expected output:
   ```
   Server is running on http://localhost:3000
   Socket.io server is ready for real-time updates
   MongoDB connected successfully
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/studentdine
   ```

2. **Serve the frontend** (using any local server)
   ```bash
   python -m http.server 8000
   # or
   npx http-server -p 8000
   ```

3. **Access the application**
   Open your browser and navigate to `http://localhost:8000`

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)

### Protected Routes (require JWT token)
- `GET /api/menu` - Get all menu items
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

### Manager Routes
- `GET /api/manager/orders` - Get all orders
- `PUT /api/manager/orders/:id` - Update order status

## Frontend Features

### Authentication
- Register with email, roll number, name, password, and role
- Login with email or roll number
- JWT token stored in localStorage
- Automatic session timeout after 30 minutes
- Session refresh on user activity

### Real-time Updates
- Socket.io client automatically connects after login
- Receives order status updates
- Custom event listeners for real-time features

### Animated UI
- Smooth page load animations
- Hover effects on cards
- Gradient animations
- Button animations
- Responsive design with animations on all screen sizes

## Code Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection
├── models/
│   ├── User.js               # User schema with password hashing
│   ├── MenuItem.js           # Menu item schema
│   ├── Order.js              # Order schema with status tracking
│   └── Coupon.js             # Coupon schema
├── middleware/
│   ├── logger.js             # Request logging
│   ├── auth.js               # JWT verification & authorization
│   └── errorHandler.js       # Centralized error handling
├── socket/
│   └── orderSocket.js        # Socket.io event handlers
├── controllers/
│   └── authController.js     # Auth logic (updated with JWT)
├── routes/
│   └── authRoutes.js
├── scripts/
│   └── migrate.js            # Data migration script
├── .env                       # Environment variables
└── server.js                  # Express + Socket.io setup

frontend/studentdine/
├── index.html                # Landing page with animations
├── auth.js                   # Enhanced with JWT & Socket.io
├── style.css                 # Animated CSS (new animations)
└── ...
```

## Security Best Practices

1. **Password Hashing**
   - Passwords are hashed with bcryptjs (10 salt rounds)
   - Never stored in plain text
   - Compared securely using `comparePassword()` method

2. **JWT Tokens**
   - 7-day expiration by default
   - Stored securely in localStorage (consider secure cookies for production)
   - Verified on each protected request

3. **Environment Variables**
   - Store sensitive data in `.env`
   - Never commit `.env` to version control
   - Change JWT_SECRET in production

4. **CORS**
   - Configured for frontend origin only
   - Prevent cross-origin attacks

5. **Error Handling**
   - Never expose sensitive error details
   - Centralized error handler for consistency

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in `.env`
- For MongoDB Atlas, verify IP whitelist and credentials

### Socket.io Not Connecting
- Check browser console for errors
- Verify Socket.io is initialized after login
- Ensure backend server is running on port 3000

### Authentication Errors
- Clear localStorage: `localStorage.clear()`
- Re-login to get new JWT token
- Check JWT_SECRET matches between frontend and backend

### Migration Issues
- Backup JSON files before migration
- Ensure MongoDB is running
- Check console output for migration statistics

## Performance Optimization

- Lazy load Socket.io client after user authentication
- JWT tokens reduce database queries on each request
- Middleware stack is optimized for minimal overhead
- Animations use CSS only (no JavaScript performance impact)

## Future Enhancements

- [ ] Refresh token mechanism
- [ ] User profile updates
- [ ] Order history filtering
- [ ] Advanced search and filtering
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS alerts for order status

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs
3. Verify environment variables
4. Check backend server status

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Backend**: Express.js + MongoDB + Socket.io  
**Frontend**: Vanilla HTML/CSS/JS with Socket.io client
