const fs = require('fs');
const path = require('path');

// GET /api/staff - Get all staff members
async function getStaff(req, res) {
  try {
    const dataFile = path.join(__dirname, '../data/staff.json');
    const staff = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
}

// GET /api/staff/:id - Get staff member by ID
async function getStaffById(req, res) {
  try {
    const { id } = req.params;
    const dataFile = path.join(__dirname, '../data/staff.json');
    const staff = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const member = staff.find(s => s.id === id);
    
    if (!member) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff member' });
  }
}

// GET /api/staff/restaurant/:restaurant - Get staff by restaurant
async function getStaffByRestaurant(req, res) {
  try {
    const { restaurant } = req.params;
    const dataFile = path.join(__dirname, '../data/staff.json');
    const staff = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const members = staff.filter(s => s.restaurant === restaurant);
    
    res.json({ success: true, data: members });
  } catch (error) {
    console.error('Get staff by restaurant error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
}

module.exports = {
  getStaff,
  getStaffById,
  getStaffByRestaurant,
};
