# StudentDine Portal - v0.1.0

A modern campus food ordering portal with real-time updates, role-based access, and a beautiful animated interface.

## What's New in This Release

This major upgrade brings enterprise-grade features to StudentDine:

- **MongoDB Database** - Scalable, document-based storage
- **Secure Authentication** - bcrypt hashing + JWT tokens
- **Real-time Updates** - Socket.io for live order tracking
- **Professional Middleware** - Logging, authentication, error handling
- **Animated UI** - Smooth CSS animations throughout the app
- **Role-based Access** - Student, Hosteller, and Manager portals

## Quick Start

### Prerequisites
- Node.js 14+
- MongoDB (local or Atlas)
- A modern web browser

### Setup (2 minutes)

#### 1. Backend Setup
```bash
cd backend
npm install
npm run migrate          # Migrate existing data to MongoDB
npm start               # Start server on port 3000
```

#### 2. Frontend Setup
```bash
cd frontend/studentdine
python -m http.server 8000  # or npx http-server -p 8000
# Open http://localhost:8000
```

### Default Test Credentials

After migration, you can login with:
- **Email**: `student@campus.edu` | **Password**: `password123`
- **Email**: `hosteller@campus.edu` | **Password**: `password123`
- **Email**: `manager@campus.edu` | **Password**: `password123`

## Features

### For Students & Hostellers
- 🔐 Secure account with JWT authentication
- 🍽️ Browse menu with real-time availability
- 🛒 Add items to cart with live price updates
- 📱 Real-time order status tracking
- 💳 Wallet-based payments
- 🎟️ Apply discount coupons

### For Managers
- 📊 Dashboard with all incoming orders
- ✅ Accept and manage order status
- ⏱️ Set estimated delivery times
- 🔔 Real-time notifications on new orders
- 📈 View order history and statistics

### Technical Features
- 🔒 Password hashing with bcryptjs
- 🎟️ JWT token authentication
- 🔄 Real-time WebSocket updates (Socket.io)
- 📝 Request logging middleware
- ⚡ Role-based authorization
- 🎨 Pure CSS animations (no dependencies)

## Project Structure

```
StudentDine/
├── backend/                    # Express.js API
│   ├── models/                # Mongoose schemas
│   ├── middleware/            # Auth, logging, error handling
│   ├── socket/                # Socket.io handlers
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   ├── scripts/               # Migration script
│   ├── config/                # Database config
│   ├── .env                   # Environment variables
│   └── server.js              # Entry point
│
├── frontend/                   # Vanilla HTML/CSS/JS
│   └── studentdine/
│       ├── index.html         # Landing page
│       ├── style.css          # Animated styles
│       ├── auth.js            # JWT + Socket.io
│       ├── app.js             # App logic
│       ├── store.html         # Food ordering
│       ├── checkout.html      # Payment checkout
│       └── ...
│
├── UPGRADE_GUIDE.md           # Detailed setup guide
├── DEVELOPER_REFERENCE.md     # Code reference
└── README.md                  # This file
```

## API Overview

### Authentication
```javascript
POST   /api/auth/register    // Register new user
POST   /api/auth/login       // Login (returns JWT)
```

### Menu & Orders
```javascript
GET    /api/menu             // Get all items
POST   /api/orders           // Create order
GET    /api/orders           // Get my orders
PUT    /api/orders/:id       // Update order (manager only)
```

### Real-time (Socket.io)
```javascript
join_user_room(userId)           // Get personal updates
order_status_changed(data)        // Listen for status changes
new_order_received(order)         // Manager notifications
```

## Configuration

### Environment Variables (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/studentdine

# Authentication
JWT_SECRET=your_super_secret_key_change_in_production

# Environment
NODE_ENV=development
```

### For MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/studentdine
```

## Key Technologies

| Component | Technology |
|-----------|-----------|
| Backend | Express.js 4.22 |
| Database | MongoDB 9.5 + Mongoose |
| Real-time | Socket.io 4.8 |
| Authentication | JWT + bcryptjs |
| Frontend | HTML5, CSS3, Vanilla JS |
| Security | CORS, JWT, bcrypt |

## Development Workflow

### Running Locally
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend/studentdine
python -m http.server 8000
```

### Database Migration
```bash
cd backend
npm run migrate
```

### Debugging
- **Backend logs** - See request logs and errors in terminal
- **Browser console** - See Socket.io connection status
- **MongoDB Compass** - Inspect collections visually

## Security Highlights

✅ Passwords hashed with bcryptjs (10 salt rounds)  
✅ JWT tokens with 7-day expiration  
✅ Role-based access control  
✅ CORS protection  
✅ Input validation  
✅ Centralized error handling  
✅ No sensitive data in logs  

## Performance

- Socket.io lazy-loaded after login
- Middleware stack optimized for minimal overhead
- CSS-only animations (zero JS performance impact)
- JWT reduces database queries
- Connection pooling for MongoDB

## Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongod

# Check port 3000 is available
lsof -i :3000
```

### Socket.io not connecting
- Check backend is running on port 3000
- Open browser DevTools → Console for errors
- Verify frontend origin in CORS settings

### Login failing
- Clear browser storage: `localStorage.clear()`
- Check MongoDB connection
- Verify credentials in backend logs

See `UPGRADE_GUIDE.md` for more troubleshooting.

## Documentation

- **UPGRADE_GUIDE.md** - Complete setup & feature documentation
- **DEVELOPER_REFERENCE.md** - Code snippets & quick reference
- **backend/README.md** - Backend-specific docs
- **frontend/studentdine/README.md** - Frontend docs

## Migration from Previous Version

If upgrading from JSON storage:

```bash
cd backend
npm install
npm run migrate
```

The migration script will:
- Hash all existing passwords
- Move data to MongoDB
- Create proper indexes
- Show statistics

Your existing data remains in JSON files and is never deleted.

## Next Steps

1. ✅ Setup MongoDB connection
2. ✅ Run migration script
3. ✅ Start backend server
4. ✅ Start frontend server
5. ✅ Login with test credentials
6. ✅ Test real-time order tracking

## Contributing

1. Create a new branch for features
2. Follow existing code patterns
3. Test thoroughly before committing
4. Document your changes

## Support & Issues

- Check the troubleshooting section
- Review backend logs for errors
- Check browser console for frontend errors
- See UPGRADE_GUIDE.md for detailed help

## Version History

### v0.1.0 (Current)
- MongoDB integration with Mongoose
- JWT-based authentication with bcrypt
- Socket.io real-time updates
- Middleware system (logger, auth, error handler)
- Animated landing page
- Data migration script

### v0.0.1 (Previous)
- JSON file-based storage
- Basic authentication
- Role-based portals

## License

All rights reserved - StudentDine Portal 2026

## Team

Built with ❤️ for the student community

---

**Version**: 0.1.0  
**Last Updated**: April 2026  
**Status**: Production Ready  

For more details, see the docs linked above!
