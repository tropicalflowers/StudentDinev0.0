const { getPrisma, isPrismaConnected } = require('../config/prisma');

const LOG_TAG = 'PostgreSQL Restaurant CRUD active';

function prismaUnavailable(res) {
  return res.status(503).json({
    success: false,
    message: 'PostgreSQL is unavailable. Restaurant CRUD requires Prisma connection.',
  });
}

function toClientRestaurant(row) {
  return {
    id: row.restaurantId,
    restaurantId: row.restaurantId,
    name: row.name,
    cluster: row.cluster,
    address: row.address || '',
    phone: row.phone || '',
    email: row.email || '',
    manager: row.manager || '',
    capacity: row.capacity,
    isOpen: row.isOpen,
    statusNote: row.statusNote || '',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function getClient() {
  if (!isPrismaConnected()) {
    return null;
  }
  return getPrisma();
}

// GET /api/prisma/restaurants
async function getRestaurants(req, res) {
  console.log(LOG_TAG, '— GET all restaurants');
  const prisma = getClient();
  if (!prisma) return prismaUnavailable(res);

  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, count: restaurants.length, data: restaurants.map(toClientRestaurant) });
  } catch (error) {
    console.error('Prisma get restaurants error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch restaurants from PostgreSQL' });
  }
}

// POST /api/prisma/restaurants
async function addRestaurant(req, res) {
  console.log(LOG_TAG, '— POST create restaurant');
  const prisma = getClient();
  if (!prisma) return prismaUnavailable(res);

  try {
    const { name, cluster, address, phone, email, manager, capacity, isOpen, statusNote, restaurantId } =
      req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'name is required' });
    }

    const count = await prisma.restaurant.count();
    const newRestaurantId =
      restaurantId || `REST${String(count + 1).padStart(3, '0')}${Date.now().toString().slice(-4)}`;

    const restaurant = await prisma.restaurant.create({
      data: {
        restaurantId: newRestaurantId,
        name,
        cluster: cluster || 'North Campus',
        address: address || null,
        phone: phone || null,
        email: email || null,
        manager: manager || null,
        capacity: Number(capacity) || 0,
        isOpen: isOpen !== false,
        statusNote: statusNote || '',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant added (PostgreSQL)',
      data: toClientRestaurant(restaurant),
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'restaurantId already exists' });
    }
    console.error('Prisma add restaurant error:', error);
    res.status(500).json({ success: false, message: 'Failed to add restaurant' });
  }
}

// PUT /api/prisma/restaurants/:id  (:id = restaurantId)
async function updateRestaurant(req, res) {
  const restaurantId = req.params.id;
  console.log(LOG_TAG, '— PUT update restaurant', restaurantId);
  const prisma = getClient();
  if (!prisma) return prismaUnavailable(res);

  try {
    const existing = await prisma.restaurant.findUnique({ where: { restaurantId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const { name, cluster, address, phone, email, manager, capacity, isOpen, statusNote } = req.body;
    const data = {};

    if (name !== undefined) data.name = name;
    if (cluster !== undefined) data.cluster = cluster;
    if (address !== undefined) data.address = address;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (manager !== undefined) data.manager = manager;
    if (capacity !== undefined) data.capacity = Number(capacity) || 0;
    if (isOpen !== undefined) data.isOpen = Boolean(isOpen);
    if (statusNote !== undefined) data.statusNote = statusNote;

    const restaurant = await prisma.restaurant.update({
      where: { restaurantId },
      data,
    });

    res.json({
      success: true,
      message: 'Restaurant updated (PostgreSQL)',
      data: toClientRestaurant(restaurant),
    });
  } catch (error) {
    console.error('Prisma update restaurant error:', error);
    res.status(500).json({ success: false, message: 'Failed to update restaurant' });
  }
}

// DELETE /api/prisma/restaurants/:id  (:id = restaurantId)
async function deleteRestaurant(req, res) {
  const restaurantId = req.params.id;
  console.log(LOG_TAG, '— DELETE restaurant', restaurantId);
  const prisma = getClient();
  if (!prisma) return prismaUnavailable(res);

  try {
    const existing = await prisma.restaurant.findUnique({ where: { restaurantId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    await prisma.restaurant.delete({ where: { restaurantId } });

    res.json({
      success: true,
      message: 'Restaurant deleted (PostgreSQL)',
      data: { restaurantId },
    });
  } catch (error) {
    console.error('Prisma delete restaurant error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete restaurant' });
  }
}

module.exports = {
  getRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
