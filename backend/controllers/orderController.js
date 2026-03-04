const { readData, writeData } = require('../helpers/fileHelper');

// GET /api/orders
function getAllOrders(req, res) {
  const orders = readData('orders.json');

  // Filter by userId if provided: ?userId=1
  if (req.query.userId) {
    const userOrders = orders.filter(o => o.userId === Number(req.query.userId));
    return res.json({ success: true, count: userOrders.length, orders: userOrders });
  }

  res.json({ success: true, count: orders.length, orders });
}

// GET /api/orders/:id
function getOrderById(req, res) {
  const orders = readData('orders.json');
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, order });
}

// POST /api/orders
function placeOrder(req, res) {
  const { userId, userName, items, subtotal, total, discount, paymentMethod, deliveryAddress, couponCode } = req.body;

  // Basic validation
  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'userId and items are required' });
  }

  if (!paymentMethod || !deliveryAddress) {
    return res.status(400).json({ success: false, message: 'paymentMethod and deliveryAddress are required' });
  }

  const orders = readData('orders.json');

  // Generate order ID like ORD003, ORD004...
  const newId = 'ORD' + String(orders.length + 1).padStart(3, '0');

  const newOrder = {
    id: newId,
    userId,
    userName: userName || 'Unknown',
    items,
    subtotal: subtotal || total,
    discount: discount || 0,
    total,
    status: 'Pending',
    paymentMethod,
    deliveryAddress,
    couponCode: couponCode || null,
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  writeData('orders.json', orders);

  res.status(201).json({ success: true, message: 'Order placed successfully', orderId: newId, order: newOrder });
}

module.exports = { getAllOrders, getOrderById, placeOrder };
