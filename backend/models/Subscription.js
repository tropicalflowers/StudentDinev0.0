const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  userName: {
    type: String,
    default: 'User',
  },
  plan: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'semester'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  price: {
    type: Number,
    default: 0,
  },
  meals: {
    type: Number,
    default: 0,
  },
  mealsUsed: {
    type: Number,
    default: 0,
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

subscriptionSchema.pre('save', function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
