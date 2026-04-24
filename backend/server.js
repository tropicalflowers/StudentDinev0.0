const app = require('./app');
const connectDB = require('./config/database');
const http = require('http');
const { Server } = require('socket.io');
const setupSocketIO = require('./socket/orderSocket');

const PORT = 3000;

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST'],
  },
});

// Setup Socket.io handlers
setupSocketIO(io);

// Connect to MongoDB
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Socket.io server is ready for real-time updates');
    console.log('Available endpoints:');
    console.log('  POST   /api/auth/register');
    console.log('  POST   /api/auth/login');
    console.log('  GET    /api/menu');
    console.log('  GET    /api/menu/:id');
    console.log('  POST   /api/menu');
    console.log('  PUT    /api/menu/:id');
    console.log('  DELETE /api/menu/:id');
    console.log('  GET    /api/orders');
    console.log('  GET    /api/orders/:id');
    console.log('  POST   /api/orders');
    console.log('  GET    /api/coupons');
    console.log('  POST   /api/coupons/validate');
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Store io instance globally for access in routes
app.set('io', io);
