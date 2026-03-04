const { readData, writeData } = require('../helpers/fileHelper');

// GET /api/mess?userId=2
function getBookings(req, res) {
  const { userId } = req.query;
  let bookings = readData('mess-bookings.json');

  if (userId) {
    bookings = bookings.filter(b => String(b.userId) === String(userId));
  }

  res.json({ success: true, bookings });
}

// POST /api/mess/book
function bookMess(req, res) {
  const { userId, userName, meal, menuOption, date, time, guests } = req.body;

  if (!userId || !meal || !date || !time) {
    return res.status(400).json({ success: false, message: 'userId, meal, date and time are required' });
  }

  const bookings = readData('mess-bookings.json');

  // Generate booking ID
  const id = 'MESS' + String(bookings.length + 1).padStart(3, '0');
  const seat = Math.floor(Math.random() * 200) + 1;

  const newBooking = {
    id,
    userId,
    userName: userName || 'User',
    meal,
    menuOption: menuOption || 'Option 1',
    date,
    time,
    seat,
    status: 'confirmed',
    guests: guests || [],
    createdAt: new Date().toISOString().split('T')[0],
  };

  bookings.push(newBooking);
  writeData('mess-bookings.json', bookings);

  res.status(201).json({
    success: true,
    message: `Mess booked! Seat #${seat} assigned.`,
    booking: newBooking,
  });
}

// POST /api/mess/cancel
function cancelMess(req, res) {
  const { bookingId, userId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ success: false, message: 'bookingId is required' });
  }

  const bookings = readData('mess-bookings.json');
  const index = bookings.findIndex(b => b.id === bookingId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  bookings[index].status = 'cancelled';
  writeData('mess-bookings.json', bookings);

  res.json({ success: true, message: 'Booking cancelled successfully', booking: bookings[index] });
}

// POST /api/mess/group
function groupBooking(req, res) {
  const { userId, userName, meal, date, time, guests } = req.body;

  if (!userId || !meal || !date || !guests || !Array.isArray(guests)) {
    return res.status(400).json({ success: false, message: 'userId, meal, date and guests array are required' });
  }

  const bookings = readData('mess-bookings.json');
  const id = 'MESS' + String(bookings.length + 1).padStart(3, '0');
  const seat = Math.floor(Math.random() * 200) + 1;

  const newBooking = {
    id,
    userId,
    userName: userName || 'User',
    meal,
    menuOption: 'Group Booking',
    date,
    time: time || '12:00',
    seat,
    status: 'confirmed',
    guests,
    guestCount: guests.length,
    createdAt: new Date().toISOString().split('T')[0],
  };

  bookings.push(newBooking);
  writeData('mess-bookings.json', bookings);

  res.status(201).json({
    success: true,
    message: `Group mess booked for ${guests.length} guest(s)! Seat #${seat} assigned.`,
    booking: newBooking,
  });
}

module.exports = { getBookings, bookMess, cancelMess, groupBooking };
