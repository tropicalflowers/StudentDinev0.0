# Quick Start Checklist - StudentDine v0.1.0

## Before You Begin

- [ ] MongoDB is installed or MongoDB Atlas account created
- [ ] Node.js 14+ is installed
- [ ] Git repository is initialized
- [ ] You have read the README.md

## Step 1: Database Setup

### Option A: Local MongoDB
```bash
# Install MongoDB (if not already installed)
# Then start the MongoDB service:
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update MONGODB_URI in backend/.env

- [ ] MongoDB is running (local or Atlas)

## Step 2: Backend Configuration

```bash
cd backend

# Install dependencies (already done? Skip if so)
npm install

# Create/update .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/studentdine
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
EOF
```

- [ ] .env file created with MongoDB URI
- [ ] JWT_SECRET configured

## Step 3: Data Migration

```bash
cd backend

# Migrate existing data from JSON to MongoDB
npm run migrate

# Expected output:
# 📦 Migrating Users...
#   ✓ Migrated X/X users
# 🍽️  Migrating Menu Items...
#   ✓ Migrated X/X menu items
# 📋 Migrating Orders...
#   ✓ Migrated X/X orders
# ✅ Migration completed successfully!
```

- [ ] Migration completed successfully
- [ ] MongoDB collections created

## Step 4: Start Backend Server

```bash
cd backend
npm start

# Expected output:
# Server is running on http://localhost:3000
# Socket.io server is ready for real-time updates
# MongoDB connected successfully
```

- [ ] Backend running on http://localhost:3000
- [ ] No errors in console

## Step 5: Start Frontend Server

**In a new terminal:**

```bash
cd frontend/studentdine

# Option A: Using Python (3.x)
python -m http.server 8000

# Option B: Using Node.js
npx http-server -p 8000

# Expected: Server running at http://localhost:8000
```

- [ ] Frontend running on http://localhost:8000
- [ ] No errors in console

## Step 6: Test the Application

### Test 1: Access Landing Page
- [ ] Open http://localhost:8000
- [ ] See animated landing page
- [ ] Logo has glow effect
- [ ] Cards fade in smoothly

### Test 2: Login
1. Click "Student Portal" (or any role)
2. Enter credentials:
   - Email: `student@campus.edu`
   - Password: `password123`
3. Click Login

- [ ] Login successful
- [ ] Redirected to student portal
- [ ] No console errors

### Test 3: Socket.io Connection
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Look for Socket.io connection message
4. Check for `[Socket.io] Connected`

- [ ] Socket.io connection established
- [ ] User room joined

### Test 4: Real-time Updates
1. Open two browser windows (or private window)
2. Login as Manager in one window
3. Login as Student in another
4. Student creates order
5. Manager updates order status
6. Student sees update in real-time

- [ ] Order status updates in real-time
- [ ] No page refresh needed

## Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
ps aux | grep mongod

# If not running:
mongod

# If port 3000 in use:
lsof -i :3000
kill -9 <PID>
```

### Frontend shows blank page
```bash
# Check backend is running
# Open browser console (F12)
# Check for CORS or connection errors
# Try hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
```

### Socket.io not connecting
```bash
# In browser console, check:
# 1. Is Socket.io library loaded?
console.log(window.io)

# 2. Any connection errors?
# Look for error messages

# 3. Is backend on correct port?
# Check http://localhost:3000
```

### Can't login
```bash
# 1. Run migration again
npm run migrate

# 2. Clear browser localStorage
localStorage.clear()

# 3. Check MongoDB has data
# Use MongoDB Compass or mongosh
```

## Quick Commands Reference

```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend/studentdine directory)
python -m http.server 8000

# Run migration
npm run migrate

# Access backend health
curl http://localhost:3000

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"student@campus.edu","password":"password123"}'

# Clear browser storage
# In browser console:
localStorage.clear()
sessionStorage.clear()
```

## Next: What to Do Now

### Immediate Actions
1. Test all default credentials (student, hosteller, manager)
2. Create a new account to verify registration
3. Test order creation and status updates
4. Check all animations render correctly

### Short Term
- [ ] Change JWT_SECRET to something secure
- [ ] Test on different browsers
- [ ] Verify all animations smooth
- [ ] Check mobile responsiveness

### Before Production
- [ ] Set NODE_ENV=production
- [ ] Configure HTTPS
- [ ] Update CORS origins
- [ ] Enable MongoDB backups
- [ ] Review security settings
- [ ] Load test the system
- [ ] Set up monitoring

## Documentation to Read

1. **README.md** - Project overview
2. **UPGRADE_GUIDE.md** - Detailed setup guide
3. **DEVELOPER_REFERENCE.md** - Code reference
4. **IMPLEMENTATION_SUMMARY.md** - What was changed

## Useful Passwords

After migration, these accounts are available:

```
Email: student@campus.edu
Password: password123
Role: student

Email: hosteller@campus.edu
Password: password123
Role: hosteller

Email: manager@campus.edu
Password: password123
Role: manager
```

## Getting Help

### Check These First
1. Browser console for JavaScript errors (F12)
2. Backend console for server errors
3. MongoDB connection in .env
4. Port availability (3000 for backend, 8000 for frontend)

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Kill process or use different port |
| MongoDB connection fail | Check MongoDB is running, verify URI |
| Socket.io not connecting | Check backend on 3000, clear browser cache |
| Login fails | Run migration again, clear localStorage |
| Animations not smooth | Check browser hardware acceleration enabled |

## Success Indicators

When everything is working:

- Backend console shows: "MongoDB connected successfully"
- Backend console shows: "Socket.io server is ready"
- Frontend loads with animations
- Can login with test credentials
- Socket.io shows connection in browser console
- Animations are smooth (no jank)
- Real-time updates work without refresh

## Final Notes

- Keep .env file secure (add to .gitignore)
- Don't commit passwords or secrets to git
- Always use HTTPS in production
- Regularly backup MongoDB
- Monitor server logs
- Test before deployment

---

**Ready to go!** Follow the checklist above to get up and running.

For more details, see the comprehensive guides in the documentation files.

Good luck! 🚀
