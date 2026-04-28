const Staff = require('../models/Staff');
const fs = require('fs');
const path = require('path');

let seedPromise = null;

async function ensureStaffSeeded() {
  const count = await Staff.estimatedDocumentCount();
  if (count > 0) return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const staffFile = path.join(__dirname, '../data/staff.json');
    const staffData = JSON.parse(fs.readFileSync(staffFile, 'utf-8'));
    await Staff.insertMany(staffData.map(member => ({
      staffId: member.id,
      name: member.name,
      role: member.role,
      restaurant: member.restaurant,
      email: member.email || '',
      phone: member.phone || '',
      department: member.department || 'Service',
      shift: member.shift || 'Morning',
      active: member.active !== false,
    })));
  })();

  return seedPromise;
}

function toClientStaff(staff) {
  const doc = staff.toObject ? staff.toObject() : staff;
  return {
    ...doc,
    id: doc.staffId,
  };
}

// GET /api/staff
async function getStaff(req, res) {
  try {
    await ensureStaffSeeded();
    const query = {};
    if (req.query.restaurant) query.restaurant = req.query.restaurant;
    const staff = await Staff.find(query).sort({ restaurant: 1, name: 1 });
    res.json({ success: true, data: staff.map(toClientStaff) });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
}

// GET /api/staff/:id
async function getStaffById(req, res) {
  try {
    await ensureStaffSeeded();
    const member = await Staff.findOne({ staffId: req.params.id });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.json({ success: true, data: toClientStaff(member) });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff member' });
  }
}

// GET /api/staff/restaurant/:restaurant
async function getStaffByRestaurant(req, res) {
  try {
    await ensureStaffSeeded();
    const members = await Staff.find({ restaurant: req.params.restaurant }).sort({ name: 1 });
    res.json({ success: true, data: members.map(toClientStaff) });
  } catch (error) {
    console.error('Get staff by restaurant error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
}

// POST /api/staff
async function addStaff(req, res) {
  try {
    const count = await Staff.countDocuments();
    const member = await Staff.create({
      staffId: req.body.staffId || `STAFF${String(count + 1).padStart(3, '0')}`,
      name: req.body.name,
      role: req.body.role || 'Waiter',
      restaurant: req.body.restaurant || 'Main Cafeteria',
      email: req.body.email || '',
      phone: req.body.phone || '',
      department: req.body.department || 'Service',
      shift: req.body.shift || 'Morning',
      active: req.body.active !== false,
    });

    res.status(201).json({ success: true, message: 'Staff member added', data: toClientStaff(member) });
  } catch (error) {
    console.error('Add staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to add staff member' });
  }
}

// PUT /api/staff/:id
async function updateStaff(req, res) {
  try {
    const member = await Staff.findOneAndUpdate(
      { staffId: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.json({ success: true, message: 'Staff member updated', data: toClientStaff(member) });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to update staff member' });
  }
}

// DELETE /api/staff/:id
async function deleteStaff(req, res) {
  try {
    const member = await Staff.findOneAndDelete({ staffId: req.params.id });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.json({ success: true, message: 'Staff member deleted', data: toClientStaff(member) });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete staff member' });
  }
}

module.exports = {
  getStaff,
  getStaffById,
  getStaffByRestaurant,
  addStaff,
  updateStaff,
  deleteStaff,
};
