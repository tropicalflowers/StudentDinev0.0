const MessBooking = require('../models/MessBooking');

function toClientBooking(booking) {
  const doc = booking.toObject ? booking.toObject() : booking;
  return {
    ...doc,
    id: doc.bookingId,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
  };
}

// GET /api/mess?userId=2
async function getBookings(req, res) {
  try {
    const query = req.query.userId ? { userId: String(req.query.userId) } : {};
    const bookings = await MessBooking.find(query).sort({ createdAt: -1 });
    res.json({ success: true, bookings: bookings.map(toClientBooking) });
  } catch (error) {
    console.error('Get mess bookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch mess bookings' });
  }
}

// POST /api/mess/book
async function bookMess(req, res) {
  try {
    const { userId, userName, meal, menuOption, date, time, guests } = req.body;

    if (!userId || !meal || !date || !time) {
      return res.status(400).json({ success: false, message: 'userId, meal, date and time are required' });
    }

    const count = await MessBooking.countDocuments();
    const seat = Math.floor(Math.random() * 200) + 1;
    const booking = await MessBooking.create({
      bookingId: 'MESS' + String(count + 1).padStart(3, '0'),
      userId: String(userId),
      userName: userName || 'User',
      meal,
      menuOption: menuOption || 'Option 1',
      date,
      time,
      seat,
      status: 'confirmed',
      guests: Array.isArray(guests) ? guests : [],
    });

    res.status(201).json({
      success: true,
      message: `Mess booked! Seat #${seat} assigned.`,
      booking: toClientBooking(booking),
    });
  } catch (error) {
    console.error('Book mess error:', error);
    res.status(500).json({ success: false, message: 'Failed to book mess meal' });
  }
}

// POST /api/mess/cancel
async function cancelMess(req, res) {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'bookingId is required' });
    }

    const booking = await MessBooking.findOneAndUpdate(
      { bookingId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking cancelled successfully', booking: toClientBooking(booking) });
  } catch (error) {
    console.error('Cancel mess error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel mess booking' });
  }
}

// POST /api/mess/group
async function groupBooking(req, res) {
  try {
    const { userId, userName, meal, date, time, guests } = req.body;

    if (!userId || !meal || !date || !guests || !Array.isArray(guests)) {
      return res.status(400).json({ success: false, message: 'userId, meal, date and guests array are required' });
    }

    const count = await MessBooking.countDocuments();
    const seat = Math.floor(Math.random() * 200) + 1;
    const booking = await MessBooking.create({
      bookingId: 'MESS' + String(count + 1).padStart(3, '0'),
      userId: String(userId),
      userName: userName || 'User',
      meal,
      menuOption: 'Group Booking',
      date,
      time: time || '12:00',
      seat,
      status: 'confirmed',
      guests,
    });

    res.status(201).json({
      success: true,
      message: `Group mess booked for ${guests.length} guest(s)! Seat #${seat} assigned.`,
      booking: toClientBooking(booking),
    });
  } catch (error) {
    console.error('Group mess error:', error);
    res.status(500).json({ success: false, message: 'Failed to create group mess booking' });
  }
}

module.exports = { getBookings, bookMess, cancelMess, groupBooking };
