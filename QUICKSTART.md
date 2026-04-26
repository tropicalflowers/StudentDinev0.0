# 🚀 Campus Food - Quick Start Guide

## **System Overview**
```
Frontend: http://localhost:8000 (Python HTTP Server)
Backend:  http://localhost:3000 (Node.js + Express)
Database: MongoDB Atlas (Cloud)
```

---

## **⚡ ONE-TIME SETUP**

### **Backend Setup**
```bash
cd backend
npm install
```

### **Configuration**
Backend is already configured with `.env` file:
```
MONGODB_URI=mongodb+srv://tanseemkashyap_db_user:gbnboCqGUqk9yyW7@cluster0.4yff0si.mongodb.net/studentdine
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_for_production
JWT_EXPIRE=7d
```

---

## **🎬 HOW TO START**

### **Terminal 1: Start Backend**
```bash
cd backend
npm start
```

**Expected Output:**
```
MongoDB connected successfully
Server is running on http://localhost:3000
Socket.io server is ready for real-time updates
```

### **Terminal 2: Start Frontend** (NEW Terminal)
```bash
cd frontend/studentdine
python -m http.server 8000
```

**Expected Output:**
```
Serving HTTP on 0.0.0.0 port 8000
```

---

## **🌐 ACCESS THE APPLICATION**

Open browser: **http://localhost:8000**

---

## **🧪 TEST CREDENTIALS**

| Role | Email | Password | Roll# |
|------|-------|----------|-------|
| 🎓 Student | `student@campus.edu` | `password123` | `23CS001` |
| 🏢 Hosteller | `hosteller@campus.edu` | `password123` | `23HT001` |
| 👔 Manager | `manager@campus.edu` | `password123` | `23MG001` |

**Or create your own account using registration form!**

---

## **✨ FEATURES TO TEST**

### **1️⃣ Authentication**
- [ ] Register new account (student/hosteller)
- [ ] Login with email
- [ ] Login with roll number
- [ ] Session persists on refresh
- [ ] Auto-logout after 7 days

### **2️⃣ Shopping**
- [ ] Browse menu items
- [ ] Search by item name
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Sort by different options

### **3️⃣ Cart & Checkout**
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Apply coupon codes (SAVE10, SAVE20, WELCOME5, HOSTEL15)
- [ ] Select delivery address
- [ ] Choose payment method (Wallet/Card/UPI/COD)

### **4️⃣ Orders**
- [ ] Place order successfully
- [ ] View order confirmation
- [ ] Track order history
- [ ] Filter orders by status
- [ ] Reorder from history

### **5️⃣ Portals**
- [ ] Day Scholar dashboard works
- [ ] Hosteller dashboard works
- [ ] Manager analytics visible
- [ ] Switch between roles
- [ ] Theme toggle (light/dark)

### **6️⃣ Admin Features**
- [ ] View total orders
- [ ] View revenue stats
- [ ] See order charts
- [ ] Manage menu items
- [ ] Manage coupons

---

## **📊 API ENDPOINTS REFERENCE**

### **Auth**
```
POST /api/auth/register   - Register new user
POST /api/auth/login      - Login user
```

### **Menu**
```
GET  /api/menu            - Get all items
GET  /api/menu/:id        - Get specific item
POST /api/menu            - Create item
PUT  /api/menu/:id        - Update item
DELETE /api/menu/:id      - Delete item
```

### **Orders**
```
GET  /api/orders          - Get user orders
GET  /api/orders/:id      - Get order details
POST /api/orders          - Create order
```

### **Coupons**
```
GET  /api/coupons         - Get all coupons
POST /api/coupons/validate - Validate coupon code
```

---

## **🧭 PROJECT STRUCTURE**

```
├── backend/
│   ├── app.js                 # Express app
│   ├── server.js              # Server entry point
│   ├── .env                   # Configuration
│   ├── package.json           # Dependencies
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   └── Coupon.js
│   ├── controllers/           # Request handlers
│   ├── routes/                # API routes
│   ├── middleware/            # Express middleware
│   ├── config/                # Database config
│   └── data/                  # JSON data files
│
└── frontend/
    └── studentdine/
        ├── index.html         # Landing page
        ├── app.js             # Landing logic
        ├── auth.js            # Auth system
        ├── cart.js            # Cart logic
        ├── data.js            # Data management
        ├── style.css          # Global styles
        ├── store.html         # Menu page
        ├── checkout.html      # Payment page
        ├── order-confirmation.html
        ├── order-history.html
        ├── auth/              # Login/Register
        ├── day-scholar/       # Day scholar portal
        ├── hosteller/         # Hosteller portal
        ├── manager/           # Manager portal
        └── admin/             # Admin dashboard
```

---

## **🐛 TROUBLESHOOTING**

### **Backend won't start**
```bash
# Check if port 3000 is in use
lsof -i :3000
# Or check MongoDB connection string in .env
```

### **Frontend won't load**
```bash
# Make sure you're in the correct directory
cd frontend/studentdine
python -m http.server 8000
```

### **Login not working**
- [ ] Backend is running (http://localhost:3000)
- [ ] MongoDB is connected
- [ ] User account exists in database
- [ ] Check browser console for errors

### **Items not showing**
- [ ] Backend API is running
- [ ] Check network tab in browser dev tools
- [ ] Verify `/api/menu` endpoint responds

---

## **📝 COMMON COUPONS**

```
SAVE10    - 10% off (min ₹200)
SAVE20    - 20% off (min ₹500)
WELCOME5  - 5% off (min ₹100)
HOSTEL15  - 15% off for hostellers (min ₹300)
```

---

## **🔐 Security Features**

- ✅ Password hashing (bcryptjs - 10 salt rounds)
- ✅ JWT tokens (7-day expiration)
- ✅ XSS prevention (input sanitization)
- ✅ CORS enabled
- ✅ Environment variables for secrets
- ✅ Session timeout (30 minutes idle)

---

## **💡 TIPS**

1. **Fast Testing:** Use demo credentials instead of registering
2. **Theme Preference:** Set once, applies everywhere
3. **Cart Persistence:** Works even after closing browser
4. **Real-time Updates:** Socket.io updates orders live
5. **Admin Access:** Login as manager to access dashboard

---

## **📞 SUPPORT**

If issues persist:
1. Check [FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md) for complete feature list
2. Verify both servers are running
3. Check `.env` configuration
4. Review browser console for errors
5. Check backend terminal for error logs

---

**Last Updated:** April 27, 2026
**Status:** ✅ Production Ready
