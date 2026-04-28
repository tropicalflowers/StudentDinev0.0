const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Waiter',
  },
  restaurant: {
    type: String,
    default: 'Main Cafeteria',
    index: true,
  },
  email: String,
  phone: String,
  department: {
    type: String,
    default: 'Service',
  },
  shift: {
    type: String,
    enum: ['Morning', 'Evening', 'Night', 'Flexible'],
    default: 'Morning',
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

staffSchema.pre('save', function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Staff', staffSchema);
