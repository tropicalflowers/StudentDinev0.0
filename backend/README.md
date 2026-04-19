# 🎓 Student Mess Management System - Backend

A complete Node.js/Express backend for managing student mess operations, orders, menus, coupons, and feedback.

---

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Project Overview](#project-overview)
- [Installation Guide](#installation-guide)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [Frontend Integration](#frontend-integration)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)

---

## ⚡ Quick Start (3 Steps)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd backend-project

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

**That's it!** Server runs on `http://localhost:5000`

---

## 📖 Project Overview

**Course:** Full Stack Development with Node.js  
**Evaluation:** Phase 1 (Lectures 1-24) ✅ Complete  
**Tech Stack:**
- Node.js
- Express.js
- File-based storage (JSON)
- *(MongoDB coming in Eval-2)*

### Features Implemented:
- ✅ User Management (Authentication controllers)
- ✅ Menu Management
- ✅ Mess Booking System
- ✅ Order Management
- ✅ Coupon System
- ✅ User Feedback
- ✅ Manager Dashboard

---

## 🛠️ Installation Guide

### Prerequisites
Make sure you have installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git**

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd backend-project
```

#### 2. Install All Dependencies
```bash
npm install
```
This will install all packages listed in `package.json`

#### 3. Create Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and set your values
nano .env
# or open it in your editor
```

**Minimum required for Eval-1:**
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### 4. Verify Installation
```bash
# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list
```

#### 5. Start the Server
```bash
npm start
```

Expected output:
```
Server running on port 5000
```

---

## 📁 Project Structure

```
backend-project/
│
├── controllers/              # Business logic for each feature
│   ├── authController.js     # User authentication
│   ├── couponController.js   # Coupon management
│   ├── managerController.js  # Manager operations
│   ├── menuController.js     # Menu operations
│   ├── messController.js     # Mess booking logic
│   └── orderController.js    # Order management
│
├── routes/                   # API endpoints
│   ├── couponRoutes.js
│   ├── managerRoutes.js
│   ├── menuRoutes.js
│   ├── messRoutes.js
│   └── orderRoutes.js
│
├── data/                     # JSON data storage (Eval-1)
│   ├── coupons.json
│   ├── feedback.json
│   ├── menu.json
│   ├── mess-bookings.json
│   ├── orders.json
│   └── users.json
│
├── helpers/                  # Utility functions
│   └── fileHelper.js         # File I/O operations
│
├── node_modules/             # Dependencies (auto-created by npm)
│
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
├── package.json              # Project metadata & dependencies
├── package-lock.json         # Locked dependency versions
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## 🔌 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
POST   /api/auth/logout        # User logout
GET    /api/auth/profile       # Get user profile
```

### Menu Endpoints
```
GET    /api/menu               # Get all menus
GET    /api/menu/:id           # Get specific menu
POST   /api/menu               # Create menu (Manager only)
PUT    /api/menu/:id           # Update menu (Manager only)
DELETE /api/menu/:id           # Delete menu (Manager only)
```

### Mess Booking Endpoints
```
GET    /api/mess               # Get all mess bookings
POST   /api/mess               # Book a mess
PUT    /api/mess/:id           # Update booking
DELETE /api/mess/:id           # Cancel booking
```

### Order Endpoints
```
GET    /api/orders             # Get user orders
POST   /api/orders             # Place an order
GET    /api/orders/:id         # Get order details
PUT    /api/orders/:id         # Update order
DELETE /api/orders/:id         # Cancel order
```

### Coupon Endpoints
```
GET    /api/coupons            # Get all coupons
POST   /api/coupons            # Create coupon (Manager only)
DELETE /api/coupons/:id        # Delete coupon
GET    /api/coupons/validate/:code  # Validate coupon
```

### Manager Endpoints
```
GET    /api/manager/dashboard  # Manager statistics
GET    /api/manager/users      # All users
GET    /api/manager/orders     # All orders
```

---

## 🔐 Environment Setup

### What is .env?
The `.env` file stores sensitive information like API keys and database credentials. It's **never committed to Git**.

### How to Set It Up

1. **Copy the template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file** with your values:
   ```
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **For production**, secure these values:
   - Don't hardcode secrets
   - Use environment variables from your hosting provider
   - Rotate API keys regularly

---

## ▶️ Running the Project

### Development Mode (Recommended for learning)
```bash
npm start
```
- Server runs on port 5000
- Check console for startup messages
- API accessible at `http://localhost:5000`

### With Nodemon (Auto-restart on file changes)
```bash
npm install -g nodemon  # Install globally (one-time)
nodemon server.js       # Run with auto-restart
```

### Check if Server is Running
```bash
# In another terminal, test the API
curl http://localhost:5000/api/menu

# Or open in browser
http://localhost:5000/api/menu
```

---

## 🔗 Frontend Integration

### Connect Your Frontend

Your backend runs on `http://localhost:5000`

In your frontend code (React/Vue/etc), set API base URL:

```javascript
// React example
const API_BASE = 'http://localhost:5000/api';

// Fetch example
fetch(`${API_BASE}/menu`)
  .then(res => res.json())
  .then(data => console.log(data));
```

### CORS Configuration
Make sure your frontend URL matches `FRONTEND_URL` in `.env`:
```
FRONTEND_URL=http://localhost:3000
```

### Frontend Repository
If you have a separate frontend repo:
```
Your Frontend Repo: <link-to-your-frontend>
```

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"
**Solution:**
```bash
# Install Node.js from https://nodejs.org/
# Then restart terminal and verify:
node --version
npm --version
```

### Problem: "Port 5000 is already in use"
**Solution:**
```bash
# Change port in .env
PORT=5001

# Or kill process using port 5000
# Linux/Mac:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Problem: "Cannot find module 'express'"
**Solution:**
```bash
# Install missing dependencies
npm install

# Or install specific package
npm install express
```

### Problem: "Module not found: data/users.json"
**Solution:**
```bash
# Check if data folder exists
ls -la backend/data/

# If missing, create it
mkdir -p backend/data
```

### Problem: "EADDRINUSE: address already in use"
**Solution:**
```bash
# Change PORT in .env or:
PORT=3001 npm start
```

### Problem: Frontend can't connect to backend
**Check:**
1. Backend is running: `npm start`
2. Backend URL is correct: `http://localhost:5000`
3. CORS is configured in `app.js`
4. Frontend URL in `.env` matches your frontend port

---

## 📚 Development Notes

### For Evaluation-2 (Coming Soon)
The following will be added:
- MongoDB database integration
- Authentication with Bcrypt & JWT
- Middleware for error handling
- Session management
- Template engines (EJS/HBS)
- Socket.io for real-time updates
- Passport.js integration

### Code Standards
- Follow existing code structure
- Use meaningful variable names
- Add comments for complex logic
- Test endpoints before pushing

### Common Development Tasks

#### Adding a New Endpoint
1. Create controller function in `/controllers`
2. Create route in `/routes`
3. Import route in `app.js`
4. Test with Postman/curl

#### Modifying JSON Data
The `fileHelper.js` handles all file operations:
```javascript
const { readFile, writeFile } = require('./helpers/fileHelper');

// Read data
const data = readFile('data/users.json');

// Write data
writeFile('data/users.json', updatedData);
```

#### Testing APIs
```bash
# Using curl
curl -X GET http://localhost:5000/api/menu

# Using Postman
# Download from https://www.postman.com/downloads/

# Using REST Client (VS Code extension)
# Install extension and create .http file
```

---

## 📞 Support & Questions

If someone encounters issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all prerequisites are installed
3. Check that `.env` is properly configured
4. Ensure port 5000 is available

---

## 📄 License

This project is created for educational purposes as part of a Full Stack Development course.

---

## ✅ Checklist for First-Time Setup

- [ ] Node.js installed (check: `node --version`)
- [ ] Repository cloned
- [ ] `npm install` completed
- [ ] `.env` file created and configured
- [ ] Server started with `npm start`
- [ ] API accessible at `http://localhost:5000`
- [ ] Frontend connected to backend

**All done? Great! Ready for development!** 🚀

---

**Last Updated:** April 2026  
**Version:** 1.0.0 (Evaluation-1)
