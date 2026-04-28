const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  walletId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userName: {
    type: String,
    default: 'User',
  },
  balance: {
    type: Number,
    default: 500,
  },
  totalEarned: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      transactionId: String,
      type: {
        type: String,
        enum: ['credit', 'debit'],
      },
      amount: Number,
      description: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

walletSchema.pre('save', function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Wallet', walletSchema);
