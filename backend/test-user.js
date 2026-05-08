const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentdine';

async function checkUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Find the newly created user
    const user = await User.findOne({ email: 'newuser@campus.edu' });
    
    if (user) {
      console.log('✓ User found in MongoDB!');
      console.log('User Details:');
      console.log('  - Name:', user.name);
      console.log('  - Email:', user.email);
      console.log('  - Roll Number:', user.rollNumber);
      console.log('  - Role:', user.role);
      console.log('  - Wallet:', user.wallet);
      console.log('  - Created At:', user.createdAt);
    } else {
      console.log('✗ User not found in MongoDB');
    }

    // Show total users in database
    const totalUsers = await User.countDocuments();
    console.log(`\nTotal users in database: ${totalUsers}`);

    // List all users
    console.log('\nAll users:');
    const allUsers = await User.find({}, 'email name role rollNumber').lean();
    allUsers.forEach((u, idx) => {
      console.log(`  ${idx + 1}. ${u.name} (${u.email}) - Role: ${u.role} - Roll: ${u.rollNumber}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ MongoDB connection closed');
  }
}

checkUser();
