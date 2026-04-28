const fs = require('fs');
const path = require('path');

// GET /api/restaurants - Get all restaurants
async function getRestaurants(req, res) {
  try {
    const dataFile = path.join(__dirname, '../data/restaurants.json');
    const restaurants = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch restaurants' });
  }
}

// GET /api/restaurants/:id - Get restaurant by ID
async function getRestaurantById(req, res) {
  try {
    const { id } = req.params;
    const dataFile = path.join(__dirname, '../data/restaurants.json');
    const restaurants = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const restaurant = restaurants.find(r => r.id === id);
    
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    
    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch restaurant' });
  }
}

module.exports = {
  getRestaurants,
  getRestaurantById,
};
