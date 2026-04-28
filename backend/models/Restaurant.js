const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  cluster: {
    type: String,
    default: 'North Campus',
  },
  address: String,
  phone: String,
  email: String,
  manager: String,
  capacity: {
    type: Number,
    default: 0,
  },
  timings: {
    breakfast: String,
    lunch: String,
    snacks: String,
    dinner: String,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  statusNote: {
    type: String,
    default: '',
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

restaurantSchema.pre('save', function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
