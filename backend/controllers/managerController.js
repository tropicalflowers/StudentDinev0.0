const { readData, writeData } = require('../helpers/fileHelper');

// GET /api/manager/stats
function getStats(req, res) {
  const orders = readData('orders.json');
  const feedback = readData('feedback.json');

  // Total sales from all orders
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Today's sales
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(today));
  const todaySales = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Total orders served
  const totalServed = orders.length;

  // Popular dish — count all items across all orders
  const itemCount = {};
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      const name = item.name || 'Unknown';
      itemCount[name] = (itemCount[name] || 0) + (item.quantity || 1);
    });
  });
  const popularDish = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No orders yet';

  // Average rating from feedback
  const avgRating = feedback.length
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : 'N/A';

  res.json({
    success: true,
    stats: {
      totalSales,
      todaySales,
      totalServed,
      todayOrders: todayOrders.length,
      popularDish,
      avgRating,
      totalFeedback: feedback.length,
    }
  });
}

// GET /api/manager/feedback
function getFeedback(req, res) {
  const feedback = readData('feedback.json');
  res.json({ success: true, feedback });
}

// POST /api/feedback  (students submit this after ordering)
function submitFeedback(req, res) {
  const { userId, userName, orderId, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  const feedback = readData('feedback.json');

  const newFeedback = {
    id: 'FB' + String(feedback.length + 1).padStart(3, '0'),
    userId: userId || 'anonymous',
    userName: userName || 'Anonymous',
    orderId: orderId || 'N/A',
    rating: Number(rating),
    comment: comment || '',
    createdAt: new Date().toISOString().split('T')[0],
  };

  feedback.push(newFeedback);
  writeData('feedback.json', feedback);

  res.status(201).json({ success: true, message: 'Thank you for your feedback!', feedback: newFeedback });
}

module.exports = { getStats, getFeedback, submitFeedback };
