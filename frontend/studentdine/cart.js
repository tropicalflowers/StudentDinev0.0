/**
 * Campus Food - Shopping Cart System
 * Connected to backend API at localhost:3000
 */

const Cart = {
  BACKEND: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || !window.location.hostname
    ? 'http://localhost:3000'
    : `${window.location.protocol}//${window.location.hostname}:3000`,
  items: [],

  // Load cart from localStorage
  load() {
    const saved = localStorage.getItem('campusFoodCart');
    if (saved) {
      try {
        this.items = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load cart:', e);
        this.items = [];
      }
    }
  },

  // Save cart to localStorage
  save() {
    localStorage.setItem('campusFoodCart', JSON.stringify(this.items));
  },

  // Add item to cart
  // NOTE: MongoDB ObjectIds are required by the backend for order creation.
  // menuItem._id contains the MongoDB ObjectId; menuItem.id is a legacy numeric ID.
  // We use _id when available and fall back to id for backward compatibility.
  addItem(menuItem, quantity = 1) {
    // Use MongoDB ObjectId (_id) if available, fall back to legacy numeric id
    const itemId = menuItem._id || menuItem.id;
    const existingItem = this.items.find(item => item.id === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: itemId,
        itemId: itemId,
        name: menuItem.name,
        price: menuItem.price,
        restaurantId: menuItem.restaurantId,
        restaurantName: menuItem.restaurantName,
        quantity,
        image: menuItem.image,
      });
    }

    this.save();
    return this.getTotalItems();
  },

  // Remove item from cart
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.save();
  },

  // Update quantity
  updateQuantity(itemId, quantity) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.save();
      }
    }
  },

  getItems()       { return this.items; },
  getTotalItems()  { return this.items.reduce((sum, item) => sum + item.quantity, 0); },
  getTotal()       { return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0); },
  isEmpty()        { return this.items.length === 0; },

  // Clear cart
  clear() {
    this.items = [];
    this.save();
  },

  // Checkout — calls backend POST /api/orders
  async checkout(orderDetails) {
    if (this.isEmpty()) {
      return { success: false, message: 'Cart is empty' };
    }

    const user = Auth.getCurrentUser();
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }
    const userId = user.id || user._id;

    if (!userId) {
      return { success: false, message: 'User session is invalid. Please login again.' };
    }

    let totalAmount = this.getTotal();
    let discount = 0;

    // Validate coupon with backend if provided
    if (orderDetails.couponCode) {
      try {
        const token = Auth.getToken();
        const couponRes = await fetch(`${this.BACKEND}/api/coupons/validate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            code: orderDetails.couponCode,
            totalAmount,
          }),
        });

        const couponResult = await couponRes.json();

        if (!couponResult.success) {
          return { success: false, message: couponResult.message };
        }

        discount = couponResult.discount;
        totalAmount = couponResult.finalAmount;

      } catch (error) {
        console.error('Coupon validation error:', error);
        return { success: false, message: 'Could not validate coupon. Is the backend running?' };
      }
    }

    // Check wallet balance if paying by wallet
    if (orderDetails.paymentMethod === 'Wallet') {
      if (user.wallet < totalAmount) {
        return { success: false, message: `Insufficient wallet balance. You have ₹${user.wallet}` };
      }
      Auth.updateWallet(userId, -totalAmount);
    }

    // Place order via backend
    try {
      const token = Auth.getToken();
      
      // Map payment method to backend format (lowercase)
      const paymentMethodMap = {
        'Wallet': 'wallet',
        'Card': 'card',
        'Cash': 'cash',
        'UPI': 'wallet',
        'Google Pay': 'card'
      };
      
      const response = await fetch(`${this.BACKEND}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          // Items now contain menuItemId as MongoDB ObjectId (from menuItem._id)
          // This ensures backend Order schema validation passes without "Cast to ObjectId" errors
          items: this.items.map(item => ({
            menuItemId: item.itemId || null,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: this.getTotal(),
          discountAmount: discount,
          finalAmount: totalAmount,
          paymentMethod: paymentMethodMap[orderDetails.paymentMethod] || 'wallet',
          deliveryAddress: orderDetails.deliveryAddress,
          specialInstructions: orderDetails.specialInstructions || '',
          couponCode: orderDetails.couponCode || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        this.clear();
      }

      return result;

    } catch (error) {
      console.error('Checkout error:', error);
      return { success: false, message: 'Could not connect to server. Is the backend running?' };
    }
  },
};

// Load cart on initialization
Cart.load();
