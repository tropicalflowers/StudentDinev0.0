const app = require('../app');
const connectDB = require('../config/database');

// Connect to MongoDB once (connection is cached in serverless)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  await connectDB();
  isConnected = true;
};

// Export the Express app as a serverless function
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
