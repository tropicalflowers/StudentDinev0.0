const app = require('../backend/app');
const connectDB = require('../backend/config/database');

// Connect to database once
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  
  return app(req, res);
};
