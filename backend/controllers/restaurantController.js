const Restaurant = require('../models/Restaurant');
const fs = require('fs');
const path = require('path');

let seedPromise = null;

async function ensureRestaurantsSeeded() {
  const count = await Restaurant.estimatedDocumentCount();
  if (count > 0) return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const restaurantsFile = path.join(__dirname, '../data/restaurants.json');
    const menuFile = path.join(__dirname, '../data/menu.json');
    const restaurantsData = JSON.parse(fs.readFileSync(restaurantsFile, 'utf-8'));
    const menuData = JSON.parse(fs.readFileSync(menuFile, 'utf-8'));
    const restaurantMap = new Map();

    restaurantsData.forEach(restaurant => restaurantMap.set(restaurant.id, restaurant));
    menuData.forEach(item => {
      if (item.restaurantId && !restaurantMap.has(item.restaurantId)) {
        restaurantMap.set(item.restaurantId, {
          id: item.restaurantId,
          name: item.restaurantName || item.restaurantId,
          cluster: 'North Campus',
          address: 'Campus food court',
          phone: '',
          email: '',
          timings: {},
          capacity: 80,
          manager: '',
          isOpen: true,
        });
      }
    });

    await Restaurant.insertMany(Array.from(restaurantMap.values()).map(restaurant => ({
      restaurantId: restaurant.id,
      name: restaurant.name,
      cluster: restaurant.cluster || 'North Campus',
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      email: restaurant.email || '',
      timings: restaurant.timings || {},
      capacity: restaurant.capacity || 0,
      manager: restaurant.manager || '',
      isOpen: restaurant.isOpen !== false,
      statusNote: restaurant.statusNote || '',
    })));
  })();

  return seedPromise;
}

function toClientRestaurant(restaurant) {
  const doc = restaurant.toObject ? restaurant.toObject() : restaurant;
  return {
    ...doc,
    id: doc.restaurantId,
  };
}

// GET /api/restaurants
async function getRestaurants(req, res) {
  try {
    await ensureRestaurantsSeeded();
    const restaurants = await Restaurant.find({}).sort({ name: 1 });
    res.json({ success: true, data: restaurants.map(toClientRestaurant) });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch restaurants' });
  }
}

// GET /api/restaurants/:id
async function getRestaurantById(req, res) {
  try {
    await ensureRestaurantsSeeded();
    const restaurant = await Restaurant.findOne({ restaurantId: req.params.id });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    res.json({ success: true, data: toClientRestaurant(restaurant) });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch restaurant' });
  }
}

// POST /api/restaurants
async function addRestaurant(req, res) {
  try {
    const count = await Restaurant.countDocuments();
    const restaurant = await Restaurant.create({
      restaurantId: req.body.restaurantId || `REST${String(count + 1).padStart(3, '0')}`,
      name: req.body.name,
      cluster: req.body.cluster || 'North Campus',
      address: req.body.address || '',
      phone: req.body.phone || '',
      email: req.body.email || '',
      manager: req.body.manager || '',
      capacity: Number(req.body.capacity) || 0,
      timings: req.body.timings || {},
      isOpen: req.body.isOpen !== false,
      statusNote: req.body.statusNote || '',
    });

    res.status(201).json({ success: true, message: 'Restaurant added', data: toClientRestaurant(restaurant) });
  } catch (error) {
    console.error('Add restaurant error:', error);
    res.status(500).json({ success: false, message: 'Failed to add restaurant' });
  }
}

// PUT /api/restaurants/:id
async function updateRestaurant(req, res) {
  try {
    const updates = { ...req.body, updatedAt: new Date() };
    if (updates.capacity !== undefined) updates.capacity = Number(updates.capacity);

    const restaurant = await Restaurant.findOneAndUpdate(
      { restaurantId: req.params.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    res.json({ success: true, message: 'Restaurant updated', data: toClientRestaurant(restaurant) });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ success: false, message: 'Failed to update restaurant' });
  }
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  addRestaurant,
  updateRestaurant,
};
