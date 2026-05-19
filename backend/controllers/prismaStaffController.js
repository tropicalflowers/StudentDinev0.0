/**
 * Prisma Staff Controller - PostgreSQL CRUD Operations
 * 
 * ARCHITECTURE FLOW:
 * Route Request → This Controller → Prisma ORM → PostgreSQL Database → JSON Response
 * 
 * REQUEST-RESPONSE CYCLE EXAMPLE (DELETE):
 * 1. Client: DELETE /api/prisma/staff/STAFF001
 * 2. Router: Routes to deleteStaff() controller function
 * 3. Controller: Extracts staffId from req.params.id
 * 4. Database Query: await prisma.staff.delete({ where: { staffId } })
 *    - This is NON-BLOCKING I/O - server handles other requests while waiting
 * 5. Response: JSON { success: true, message: 'Staff deleted' }
 * 
 * NON-BLOCKING I/O EXPLANATION:
 * - All database operations use async/await
 * - Node.js event loop remains free while database queries execute
 * - Multiple concurrent requests can be served simultaneously
 * - Server never "blocks" on I/O operations
 * 
 * ERROR HANDLING PATTERN:
 * - Try-catch block catches database errors
 * - HTTP status codes indicate error type (404 = not found, 500 = server error)
 * - Meaningful error messages for debugging
 */

const { getPrisma, isPrismaConnected } = require('../config/prisma');

const LOG_TAG = 'PostgreSQL Staff CRUD';

function prismaUnavailable(res) {
  return res.status(503).json({
    success: false,
    message: 'PostgreSQL is unavailable. Staff CRUD requires Prisma connection.',
  });
}

function toClientStaff(row) {
  return {
    id: row.id,
    staffId: row.staffId,
    name: row.name,
    role: row.role,
    email: row.email || '',
    phone: row.phone || '',
    restaurantId: row.restaurantId,
    shift: row.shift,
    isActive: row.isActive,
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

// GET /api/prisma/staff
async function getStaff(req, res) {
  console.log('[Staff Controller] GET all staff');
  const prisma = getClient();
  if (!prisma) return prismaUnavailable(res);

  try {
    const staff = await prisma.staff.findMany({
      orderBy: { name: 'asc' },
    });
    console.log(`[Staff Controller] ✓ Found ${staff.length} staff members in PostgreSQL`);
    res.json({ success: true, count: staff.length, data: staff.map(toClientStaff) });
  } catch (error) {
    console.error('[Staff Controller] ✗ GET Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch staff from PostgreSQL' });
  }
}

// GET /api/prisma/staff/restaurant/:restaurantId
async function getStaffByRestaurant(req, res) {
  const { restaurantId } = req.params;
  console.log(`[Staff Controller] GET /restaurant/${restaurantId}`);
  const prisma = getClient();
  if (!prisma) return prismaUnavailable(res);

  try {
    const staff = await prisma.staff.findMany({
      where: { restaurantId },
      orderBy: { name: 'asc' },
    });
    console.log(`[Staff Controller] ✓ Found ${staff.length} staff for restaurant ${restaurantId}`);
    res.json({ success: true, count: staff.length, data: staff.map(toClientStaff) });
  } catch (error) {
    console.error(`[Staff Controller] ✗ GET /restaurant Error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
}

// POST /api/prisma/staff
async function addStaff(req, res) {
  console.log('[Staff Controller] POST create staff');
  const prisma = getClient();
  if (!prisma) return prismaUnavailable(res);

  try {
    const { name, role, email, phone, restaurantId, shift, isActive, staffId } = req.body;

    console.log(`[Staff Controller] Request body:`, { name, role, email, phone, restaurantId, shift, isActive, staffId });

    if (!name || !restaurantId) {
      return res.status(400).json({ success: false, message: 'name and restaurantId are required' });
    }

    const count = await prisma.staff.count();
    const newStaffId = staffId || `STAFF${String(count + 1).padStart(3, '0')}${Date.now().toString().slice(-4)}`;

    console.log(`[Staff Controller] Creating staff with staffId: ${newStaffId}`);

    const staff = await prisma.staff.create({
      data: {
        staffId: newStaffId,
        name,
        role: role || 'Waiter',
        email: email || null,
        phone: phone || null,
        restaurantId,
        shift: shift || 'Morning',
        isActive: isActive !== false,
      },
    });

    console.log(`[Staff Controller] ✓ Created staff: ${staff.name} (${staff.staffId})`);
    res.status(201).json({
      success: true,
      message: 'Staff added (PostgreSQL)',
      data: toClientStaff(staff),
    });
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('[Staff Controller] ✗ Duplicate staffId:', error.message);
      return res.status(400).json({ success: false, message: 'staffId already exists' });
    }
    console.error('[Staff Controller] ✗ POST Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add staff' });
  }
}

// PUT /api/prisma/staff/:id  (:id = staffId)
async function updateStaff(req, res) {
  const staffId = req.params.id;
  console.log(`[Staff Controller] PUT update staff ${staffId}`);
  console.log(`[Staff Controller] Request body:`, req.body);
  
  const prisma = getClient();
  if (!prisma) return prismaUnavailable(res);

  try {
    const existing = await prisma.staff.findUnique({ where: { staffId } });
    if (!existing) {
      console.log(`[Staff Controller] ✗ Staff not found: ${staffId}`);
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    const { name, role, email, phone, restaurantId, shift, isActive } = req.body;
    const data = {};

    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (restaurantId !== undefined) data.restaurantId = restaurantId;
    if (shift !== undefined) data.shift = shift;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    console.log(`[Staff Controller] Updating with fields:`, data);

    const staff = await prisma.staff.update({
      where: { staffId },
      data,
    });

    console.log(`[Staff Controller] ✓ Updated staff: ${staff.name}`);
    res.json({
      success: true,
      message: 'Staff updated (PostgreSQL)',
      data: toClientStaff(staff),
    });
  } catch (error) {
    console.error('[Staff Controller] ✗ PUT Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update staff' });
  }
}

// DELETE /api/prisma/staff/:id  (:id = staffId)
async function deleteStaff(req, res) {
  const staffId = req.params.id;
  console.log(`[Staff Controller] DELETE staff ${staffId}`);
  
  const prisma = getClient();
  if (!prisma) return prismaUnavailable(res);

  try {
    const existing = await prisma.staff.findUnique({ where: { staffId } });
    if (!existing) {
      console.log(`[Staff Controller] ✗ Staff not found for deletion: ${staffId}`);
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    await prisma.staff.delete({ where: { staffId } });
    console.log(`[Staff Controller] ✓ Deleted staff: ${staffId}`);

    res.json({
      success: true,
      message: 'Staff deleted (PostgreSQL)',
      data: { staffId },
    });
  } catch (error) {
    console.error('[Staff Controller] ✗ DELETE Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete staff' });
  }
}

module.exports = {
  getStaff,
  getStaffByRestaurant,
  addStaff,
  updateStaff,
  deleteStaff,
};
