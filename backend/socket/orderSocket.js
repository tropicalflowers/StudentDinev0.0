const Order = require('../models/Order');

const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // User joins their personal room for updates
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`[Socket.io] User ${userId} joined their room`);
    });

    // Manager joins manager room to see all orders
    socket.on('join_manager_room', () => {
      socket.join('managers');
      console.log(`[Socket.io] Manager joined manager room`);
    });

    // Listen for order status updates
    socket.on('update_order_status', async (data) => {
      try {
        const { orderId, newStatus, managerId } = data;

        const order = await Order.findByIdAndUpdate(
          orderId,
          { status: newStatus, updatedAt: new Date() },
          { new: true }
        ).populate('userId', 'name email');

        if (order) {
          // Notify the customer
          io.to(`user_${order.userId._id}`).emit('order_status_changed', {
            orderId: order._id,
            status: newStatus,
            message: `Your order status has been updated to ${newStatus}`,
          });

          // Notify all managers
          io.to('managers').emit('order_updated', order);
        }
      } catch (error) {
        console.error('[Socket.io] Error updating order:', error);
        socket.emit('error', { message: 'Failed to update order status' });
      }
    });

    // Listen for new order creation
    socket.on('new_order', async (orderId) => {
      try {
        const order = await Order.findById(orderId).populate('userId', 'name email');
        if (order) {
          // Notify all managers
          io.to('managers').emit('new_order_received', order);
        }
      } catch (error) {
        console.error('[Socket.io] Error fetching new order:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocketIO;
