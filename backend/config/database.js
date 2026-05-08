const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentdine';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    const { host, name } = connection.connection;
    console.log(`MongoDB connected successfully: ${host}/${name}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
