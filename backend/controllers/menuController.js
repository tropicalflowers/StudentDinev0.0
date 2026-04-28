const MenuItem = require('../models/MenuItem');
const fs = require('fs');
const path = require('path');

let seedPromise = null;

async function ensureMenuSeeded() {
  const count = await MenuItem.estimatedDocumentCount();
  if (count > 0) return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const menuFile = path.join(__dirname, '../data/menu.json');
    const menuData = JSON.parse(fs.readFileSync(menuFile, 'utf-8'));
    await MenuItem.insertMany(menuData.map(item => ({
      legacyId: item.id,
      restaurantId: item.restaurantId || 'unknown',
      restaurantName: item.restaurantName || 'Unknown',
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category || 'snacks',
      type: item.type || (item.vegetarian ? 'veg' : 'non-veg'),
      vegetarian: item.type ? item.type === 'veg' : item.vegetarian || false,
      available: item.available !== false,
      image: item.image,
      rating: item.rating || 0,
    })));
  })();

  return seedPromise;
}

function toClientItem(item) {
  const doc = item.toObject ? item.toObject() : item;
  return {
    ...doc,
    id: doc.legacyId || doc._id.toString(),
    type: doc.type || (doc.vegetarian ? 'veg' : 'non-veg'),
    category: doc.category,
    restaurantId: doc.restaurantId || 'unknown',
    restaurantName: doc.restaurantName || 'Unknown',
    image: doc.image || '🍽️',
    rating: Number(doc.rating) || 0,
  };
}

function idFilter(id) {
  const numericId = Number(id);
  if (!Number.isNaN(numericId)) return { legacyId: numericId };
  return { _id: id };
}

// GET /api/menu
async function getAllItems(req, res) {
  try {
    await ensureMenuSeeded();
    const query = {};

    if (req.query.type && req.query.type !== 'all') {
      query.type = req.query.type;
    }

    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    if (req.query.maxPrice) {
      query.price = { $lte: Number(req.query.maxPrice) };
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { restaurantName: regex },
      ];
    }

    const menu = await MenuItem.find(query).sort({ restaurantName: 1, name: 1 });
    res.json({ success: true, count: menu.length, menu: menu.map(toClientItem) });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu' });
  }
}

// GET /api/menu/:id
async function getItemById(req, res) {
  try {
    await ensureMenuSeeded();
    const item = await MenuItem.findOne(idFilter(req.params.id));

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, item: toClientItem(item) });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu item' });
  }
}

// POST /api/menu
async function addItem(req, res) {
  try {
    const { restaurantId, restaurantName, name, description, price, category, type, image, rating } = req.body;

    if (!name || !price || !category || !type) {
      return res.status(400).json({ success: false, message: 'name, price, category, and type are required' });
    }

    const highest = await MenuItem.findOne({ legacyId: { $exists: true } }).sort({ legacyId: -1 });
    const item = await MenuItem.create({
      legacyId: (highest?.legacyId || 0) + 1,
      restaurantId: restaurantId || 'unknown',
      restaurantName: restaurantName || 'Unknown',
      name,
      description: description || '',
      price: Number(price),
      category,
      type,
      vegetarian: type === 'veg',
      image: image || '🍽️',
      available: true,
      rating: Number(rating) || 0,
    });

    res.status(201).json({ success: true, message: 'Item added', item: toClientItem(item) });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ success: false, message: 'Failed to add menu item' });
  }
}

// PUT /api/menu/:id
async function updateItem(req, res) {
  try {
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.type) updates.vegetarian = updates.type === 'veg';
    updates.updatedAt = new Date();

    const item = await MenuItem.findOneAndUpdate(idFilter(req.params.id), updates, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Item updated', item: toClientItem(item) });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ success: false, message: 'Failed to update menu item' });
  }
}

// DELETE /api/menu/:id
async function deleteItem(req, res) {
  try {
    const item = await MenuItem.findOneAndDelete(idFilter(req.params.id));

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Item deleted', item: toClientItem(item) });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete menu item' });
  }
}

module.exports = { getAllItems, getItemById, addItem, updateItem, deleteItem };
