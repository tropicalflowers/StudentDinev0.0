const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// GET /api/orders - Get all orders (or user's orders if authenticated)
async function getAllOrders(req, res) {
  try {
    let query = {};
    
    // If user is authenticated, filter by their ID
    if (req.user) {
      query.userId = req.user._id;
    }
    
    // Filter by userId if provided in query
    if (req.query.userId) {
      query.userId = req.query.userId;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
}

// GET /api/orders/:id - Get order by ID
async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.menuItemId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
}

// POST /api/orders - Place new order
async function placeOrder(req, res) {
  try {
    const { items, totalAmount, discountAmount, finalAmount, paymentMethod, deliveryAddress, specialInstructions, couponCode } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required' });
    }

    if (!finalAmount) {
      return res.status(400).json({ success: false, message: 'finalAmount is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'paymentMethod is required' });
    }

    // Create order
    const newOrder = await Order.create({
      userId: req.user._id,
      items: items.map(item => ({
        menuItemId: item.menuItemId || null,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalAmount || finalAmount,
      discountAmount: discountAmount || 0,
      finalAmount,
      paymentMethod,
      deliveryAddress: deliveryAddress || 'On Campus',
      specialInstructions: specialInstructions || '',
      couponCode: couponCode || null,
      status: 'Pending',
    });

    // Emit Socket.io event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order', newOrder);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder,
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
}

// PUT /api/orders/:id - Update order status (manager only)
async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Emit Socket.io event
    const io = req.app.get('io');
    if (io) {
      io.emit('order_updated', order);
      io.to(order.userId.toString()).emit('order_status_changed', {
        orderId: order._id,
        status: order.status,
      });
    }

    res.json({ success: true, message: 'Order updated', data: order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
}


module.exports = { getAllOrders, getOrderById, placeOrder, updateOrderStatus };
