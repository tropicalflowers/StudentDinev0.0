const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  legacyId: {
    type: Number,
    unique: true,
    sparse: true,
  },
  restaurantId: {
    type: String,
    default: 'unknown',
    index: true,
  },
  restaurantName: {
    type: String,
    default: 'Unknown',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['starter', 'main', 'drinks', 'breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'],
    required: true,
  },
  type: {
    type: String,
    enum: ['veg', 'non-veg'],
    default: 'veg',
  },
  vegetarian: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
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

menuItemSchema.pre('save', function () {
  this.updatedAt = new Date();
  if (!this.type) this.type = this.vegetarian ? 'veg' : 'non-veg';
  this.vegetarian = this.type === 'veg';
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
