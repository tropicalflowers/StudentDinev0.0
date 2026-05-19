# Student Dine Backend - Architecture & Node.js Fundamentals

## 🏗️ Architecture Overview

### Request-Response Cycle Flow

```
Client Request
    ↓
HTTP Module (Express Server on Port 3000)
    ↓
CORS & Body Parser Middleware
    ↓
Logger Middleware (Request Logging)
    ↓
Route Matching (Express Router)
    ↓
Route Handler (Controller Function)
    ↓
Business Logic (async/await)
    ↓
Database Query (Mongoose or Prisma)
    ↓
Response Formatting (toClientStaff, toClientItem, etc.)
    ↓
JSON Response to Client
```

**Example Flow: DELETE Staff**
```
DELETE /api/prisma/staff/STAFF005
    ↓
app.js: app.use('/api/prisma/staff', prismaStaffRoutes)
    ↓
prismaStaffRoutes.js: router.delete('/:id', deleteStaff)
    ↓
prismaStaffController.js: async function deleteStaff(req, res)
    ↓
Prisma Query: await prisma.staff.delete({ where: { staffId } })
    ↓
Response: { success: true, message: 'Staff deleted' }
```

---

## 🔄 Non-Blocking I/O & Event Loop

### How It Works

The server remains responsive during database queries because Node.js uses **asynchronous I/O**:

#### Traditional Blocking Code (❌ Bad)
```javascript
const user = getUserSync(); // Thread BLOCKS here - other requests WAIT
const orders = getOrdersSync(); // Thread BLOCKED again
res.json(user);
```

#### Non-Blocking Async/Await (✅ Good)
```javascript
const user = await User.findById(id); // Thread continues, processes other requests
const orders = await Order.find({ userId: id });
res.json({ user, orders });
```

### Request Handling Process

1. **Request arrives** → Added to Event Loop queue
2. **Async function called** → `await prisma.staff.delete()`
3. **Database query starts** → Thread is FREE to handle OTHER requests
4. **Query completes** → Callback resolves, response is sent
5. **Main thread never blocks**

---

## 📦 Module Configuration & Environment

### Node.js Environment Standardization

**package.json - Defined Entry Point**
```json
{
  "name": "studentdine-backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

**Running the Server**
```bash
npm start  # Uses the standardized script
```

### Environment Variables (.env)

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/studentdine
DATABASE_URL=postgresql://user:pass@localhost/studentdine
JWT_SECRET=your-secret-key
NODE_ENV=development
```

---

## 📂 File Handling & Modular Imports

### File Organization Structure

```
backend/
├── app.js                  # Express app setup
├── server.js              # Server initialization & port
├── config/
│   ├── database.js        # MongoDB connection
│   └── prisma.js          # PostgreSQL/Prisma connection
├── controllers/           # Business logic
│   ├── authController.js
│   ├── menuController.js
│   ├── prismaStaffController.js
│   └── ...
├── models/               # Database schemas
│   ├── User.js
│   ├── MenuItem.js
│   └── ...
├── routes/              # Route definitions
│   ├── authRoutes.js
│   ├── prismaStaffRoutes.js
│   └── ...
├── middleware/          # Middleware functions
│   ├── auth.js
│   ├── errorHandler.js
│   └── logger.js
└── data/               # JSON seed data
    ├── users.json
    ├── menu.json
    └── ...
```

### Modular Imports Example

**app.js**
```javascript
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const prismaStaffRoutes = require('./routes/prismaStaffRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/prisma/staff', prismaStaffRoutes);
```

**Benefits:**
- ✓ Clean separation of concerns
- ✓ Easy to maintain and scale
- ✓ Reusable controllers across routes
- ✓ Independent module testing

---

## 🛣️ Express.js Web Framework

### 1. Routing Architecture with Path Parameters

**prismaStaffRoutes.js**
```javascript
router.get('/', getStaff);                              // GET /api/prisma/staff
router.get('/restaurant/:restaurantId', getStaffByRestaurant); // GET /api/prisma/staff/restaurant/:restaurantId
router.post('/', addStaff);                             // POST /api/prisma/staff
router.put('/:id', updateStaff);                        // PUT /api/prisma/staff/:id
router.delete('/:id', deleteStaff);                     // DELETE /api/prisma/staff/:id
```

**Accessing Route Parameters in Controller**
```javascript
async function deleteStaff(req, res) {
  const staffId = req.params.id;           // Extract :id parameter
  const restaurantId = req.params.restaurantId;  // Extract :restaurantId
  
  await prisma.staff.delete({ where: { staffId } });
  res.json({ success: true });
}
```

### 2. Static Files Serving

**app.js**
```javascript
// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Access: http://localhost:3000/uploads/image.jpg
```

### 3. Exception Handling

**Controllers - Try-Catch Pattern**
```javascript
async function deleteStaff(req, res) {
  try {
    const existing = await prisma.staff.findUnique({ where: { staffId } });
    
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    await prisma.staff.delete({ where: { staffId } });
    res.json({ success: true, message: 'Staff deleted' });
    
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete staff' });
  }
}
```

**Global Error Middleware - errorHandler.js**
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  // Generic error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

app.use(errorHandler);  // Mount at end of app.js
```

---

## 🗄️ Database Connectivity

### MongoDB (Mongoose) - Primary DB
```javascript
// config/database.js - Non-blocking connection
async function connectDB() {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
}
```

### PostgreSQL (Prisma) - Optional DB
```javascript
// config/prisma.js - Graceful connection
async function connectPrisma() {
  try {
    const client = getPrisma();
    await client.$connect();
    console.log('PostgreSQL connected (Prisma)');
    return true;
  } catch (error) {
    console.warn('PostgreSQL unavailable:', error.message);
    return false; // Server continues without PostgreSQL
  }
}
```

---

## 🔐 Middleware Pipeline

**Order of Execution in app.js**

```javascript
1. cors()                    // Enable cross-origin requests
2. express.json()            // Parse JSON body
3. loggerMiddleware          // Log all requests
4. express.static()          // Serve static files
5. Routes (auth, menu, etc.) // Handle requests
6. 404 handler              // Catch undefined routes
7. errorHandler             // Global error handling
```

---

## 📊 Complete Request Lifecycle Example

### Scenario: DELETE /api/prisma/staff/STAFF001

```
1. CLIENT SENDS REQUEST
   DELETE /api/prisma/staff/STAFF001
   Authorization: Bearer token123

2. SERVER RECEIVES (server.js)
   ↓
   
3. MIDDLEWARE PROCESSING (app.js)
   - CORS middleware: Check origin
   - Body parser: Parse JSON
   - Logger: Log request method & path
   
4. ROUTE MATCHING (app.js)
   app.use('/api/prisma/staff', prismaStaffRoutes)
   ↓
   
5. ROUTE HANDLER (prismaStaffRoutes.js)
   router.delete('/:id', deleteStaff)
   ↓
   
6. CONTROLLER EXECUTION (prismaStaffController.js)
   async function deleteStaff(req, res) {
     try {
       const staffId = req.params.id; // Extract 'STAFF001'
       
       // DATABASE QUERY - Non-blocking I/O
       const existing = await prisma.staff.findUnique({ 
         where: { staffId } 
       });
       
       if (!existing) {
         return res.status(404).json({ 
           success: false, 
           message: 'Staff not found' 
         });
       }
       
       await prisma.staff.delete({ where: { staffId } });
       
       // RESPONSE
       res.json({
         success: true,
         message: 'Staff deleted (PostgreSQL)',
         data: { staffId }
       });
     } catch (error) {
       // ERROR HANDLING
       console.error('Delete staff error:', error);
       res.status(500).json({ 
         success: false, 
         message: 'Failed to delete staff' 
       });
     }
   }
   
7. GLOBAL ERROR HANDLER (if error thrown)
   errorHandler middleware catches and responds
   
8. RESPONSE SENT TO CLIENT
   Status: 200
   Body: { success: true, message: 'Staff deleted', data: { staffId: 'STAFF001' } }
```

---

## 🚀 Key Best Practices Implemented

✅ **Non-Blocking I/O** - All DB calls use async/await  
✅ **Error Handling** - Try-catch in controllers + global middleware  
✅ **Modular Code** - Routes, controllers, models separated  
✅ **Environment Config** - .env for credentials  
✅ **Route Parameters** - Dynamic routes with `:id`, `:restaurantId`  
✅ **Static Files** - `/uploads` served via express.static  
✅ **CORS Support** - Configured for frontend communication  
✅ **Logging** - Request/response logging middleware  
✅ **Graceful Failures** - PostgreSQL optional, MongoDB required  

---

## 📝 Summary

This architecture follows professional Node.js/Express.js patterns:
- **Non-blocking I/O** keeps server responsive
- **Modular file structure** maintains code quality
- **Exception handling** at controller & global levels
- **Route parameters** enable RESTful API design
- **Static file serving** for assets
- **Dual database support** (MongoDB + PostgreSQL/Prisma)

All code examples reference actual files in the backend with proper async/await, error handling, and request-response flows.
