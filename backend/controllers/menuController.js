const { readData, writeData } = require('../helpers/fileHelper');

// GET /api/menu
function getAllItems(req, res) {
  const menu = readData('menu.json');

  // Support query filters: ?type=veg&category=main&maxPrice=300
  let result = [...menu];

  if (req.query.type && req.query.type !== 'all') {
    result = result.filter(item => item.type === req.query.type);
  }

  if (req.query.category && req.query.category !== 'all') {
    result = result.filter(item => item.category === req.query.category);
  }

  if (req.query.maxPrice) {
    result = result.filter(item => item.price <= Number(req.query.maxPrice));
  }

  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    result = result.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.restaurantName.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, menu: result });
}

// GET /api/menu/:id
function getItemById(req, res) {
  const menu = readData('menu.json');
  const item = menu.find(m => m.id === Number(req.params.id));

  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  res.json({ success: true, item });
}

// POST /api/menu
function addItem(req, res) {
  const { restaurantId, restaurantName, name, description, price, category, type, image } = req.body;

  if (!name || !price || !category || !type) {
    return res.status(400).json({ success: false, message: 'name, price, category, and type are required' });
  }

  const menu = readData('menu.json');

  const newItem = {
    id: Math.max(...menu.map(m => m.id)) + 1,
    restaurantId: restaurantId || 'unknown',
    restaurantName: restaurantName || 'Unknown',
    name,
    description: description || '',
    price: Number(price),
    category,
    type,
    image: image || '🍽️',
    available: true,
    rating: 0,
  };

  menu.push(newItem);
  writeData('menu.json', menu);

  res.status(201).json({ success: true, message: 'Item added', item: newItem });
}

// PUT /api/menu/:id
function updateItem(req, res) {
  const menu = readData('menu.json');
  const index = menu.findIndex(m => m.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  menu[index] = { ...menu[index], ...req.body };
  writeData('menu.json', menu);

  res.json({ success: true, message: 'Item updated', item: menu[index] });
}

// DELETE /api/menu/:id
function deleteItem(req, res) {
  const menu = readData('menu.json');
  const index = menu.findIndex(m => m.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  const deleted = menu.splice(index, 1);
  writeData('menu.json', menu);

  res.json({ success: true, message: 'Item deleted', item: deleted[0] });
}

module.exports = { getAllItems, getItemById, addItem, updateItem, deleteItem };
