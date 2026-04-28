const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  rollNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'hosteller', 'manager'],
    default: 'student',
  },
  wallet: {
    type: Number,
    default: 500,
  },
  cluster: {
    type: String,
    enum: ['North Campus', 'South Campus', 'East Campus', 'West Campus'],
    default: 'North Campus',
  },
  restaurant: {
    type: String,
    default: 'Main Cafeteria',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  const storedPassword = this.password || '';

  if (/^\$2[aby]\$/.test(storedPassword)) {
    return await bcrypt.compare(candidatePassword, storedPassword);
  }

  // Supports databases that were populated from the old JSON seed directly.
  if (candidatePassword === storedPassword) {
    this.password = candidatePassword;
    await this.save();
    return true;
  }

  return false;
};

// Method to return user without password
userSchema.methods.toJSON = function () {
  const { password, ...user } = this.toObject();
  user.id = user._id.toString();
  return user;
};

module.exports = mongoose.model('User', userSchema);
