# StudentDine - Developer Quick Reference

## Running the Application

### Start Backend
```bash
cd backend
npm install  # (if not done already)
npm start
```

### Start Frontend
```bash
cd frontend/studentdine
python -m http.server 8000
# Navigate to http://localhost:8000
```

## Key Files Changed

### Backend
| File | Changes |
|------|---------|
| `server.js` | Added HTTP server + Socket.io setup |
| `app.js` | Added logger & error handler middleware |
| `.env` | New file with MongoDB URI and JWT secret |
| `config/database.js` | New MongoDB connection file |
| `models/User.js` | New Mongoose schema with password hashing |
| `models/MenuItem.js` | New menu item schema |
| `models/Order.js` | New order schema with status tracking |
| `models/Coupon.js` | New coupon schema |
| `middleware/logger.js` | New request logging middleware |
| `middleware/auth.js` | New JWT verification middleware |
| `middleware/errorHandler.js` | New error handling middleware |
| `socket/orderSocket.js` | New Socket.io event handlers |
| `controllers/authController.js` | Updated with JWT + bcrypt |
| `scripts/migrate.js` | New data migration script |
| `package.json` | Added migrate script |

### Frontend
| File | Changes |
|------|---------|
| `style.css` | Added CSS animations (fadeInUp, floatUp, glow, etc.) |
| `auth.js` | Added JWT token storage + Socket.io integration |

## Authentication Flow

1. User registers → Password hashed with bcryptjs → JWT token generated
2. User logs in → Password compared → JWT token returned
3. Frontend stores token in localStorage
4. Socket.io connects with user ID for real-time updates
5. Protected endpoints require `Authorization: Bearer <token>` header

## Socket.io Real-time Events

### Client Events (Frontend → Backend)
```javascript
socket.emit('join_user_room', userId);           // Join personal room
socket.emit('join_manager_room');                // Join manager room
socket.emit('update_order_status', {             // Update order
  orderId: '...',
  newStatus: 'Cooking',
  managerId: '...'
});
```

### Server Events (Backend → Frontend)
```javascript
socket.on('order_status_changed', (data) => {    // Order updated
  console.log('New status:', data.status);
});
socket.on('new_order_received', (order) => {     // New order
  console.log('Order:', order);
});
```

## Database Schema Examples

### User
```javascript
{
  _id: ObjectId,
  email: "student@campus.edu",
  rollNumber: "23CS001",
  name: "Aarav Sharma",
  password: "hashed_with_bcrypt",  // Never plain text
  role: "student",                 // student|hosteller|manager
  wallet: 1500,
  createdAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [
    { menuItemId: ObjectId, name: "Biryani", quantity: 2, price: 200 }
  ],
  totalAmount: 400,
  finalAmount: 360,
  status: "Cooking",              // Pending|Accepted|Cooking|Ready|Delivered
  paymentMethod: "wallet",
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/studentdine
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

## API Response Format

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Error:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Common Tasks

### Add a new protected route
```javascript
const { authMiddleware, authorize } = require('../middleware/auth');

router.get('/protected', authMiddleware, authorize(['student', 'manager']), (req, res) => {
  const user = req.user;  // User info from middleware
  res.json({ user });
});
```

### Send real-time update to user
```javascript
const io = req.app.get('io');
io.to(`user_${userId}`).emit('order_status_changed', { orderId, status });
```

### Hash a password manually
```javascript
const bcrypt = require('bcryptjs');
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);
```

### Verify JWT token manually
```javascript
const jwt = require('jsonwebtoken');
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

## Testing Authentication

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@campus.edu",
    "rollNumber": "23CS999",
    "name": "Test User",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@campus.edu",
    "password": "password123"
  }'
```

### Protected Request
```bash
curl -X GET http://localhost:3000/api/menu \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## Migration

Run migration to move data from JSON to MongoDB:
```bash
cd backend
npm run migrate
```

This will:
- Hash all existing passwords
- Create MongoDB collections
- Show migration statistics
- Validate all data

## CSS Animations

All animations are CSS-only (no JavaScript libraries):
- `fadeInUp` - Fade in with slight upward movement
- `floatUp` - Continuous floating effect
- `slideInFromLeft/Right` - Slide from side
- `glow` - Glowing effect on elements
- `gradientShift` - Background gradient animation

Customize in `style.css` using `@keyframes`.

## Debugging Tips

1. **Check browser console** for Socket.io connection errors
2. **Check backend logs** for request/error logs (logger middleware)
3. **Use MongoDB Compass** to inspect collections
4. **Monitor JWT token expiration** - 7 days from login
5. **Verify CORS settings** if frontend can't reach backend

---

**Last Updated**: April 2026
