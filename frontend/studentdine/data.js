/**
 * Campus Food - Data Layer
 * Now fetches from backend API at localhost:3000
 * Falls back to local data if backend is unreachable
 */

const CampusFoodDB = {
  BACKEND: 'http://localhost:3000',

  // ── Fetch menu from backend ─────────────────────────────
  // Replaces: CampusFoodDB.menuItems
  async getMenu(filters = {}) {
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.type     && filters.type     !== 'all') params.append('type',     filters.type);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.maxPrice)                               params.append('maxPrice', filters.maxPrice);
      if (filters.search)                                 params.append('search',   filters.search);

      const url = `${this.BACKEND}/api/menu${params.toString() ? '?' + params : ''}`;
      const response = await fetch(url);
      const result = await response.json();

      return result.menu || [];

    } catch (error) {
      console.error('Could not fetch menu from backend:', error);
      return [];
    }
  },

  // ── Fetch single menu item ──────────────────────────────
  async getMenuItem(id) {
    try {
      const response = await fetch(`${this.BACKEND}/api/menu/${id}`);
      const result = await response.json();
      return result.item || null;
    } catch (error) {
      console.error('Could not fetch menu item:', error);
      return null;
    }
  },

  // ── Fetch all coupons from backend ──────────────────────
  async getCoupons() {
    try {
      const response = await fetch(`${this.BACKEND}/api/coupons`);
      const result = await response.json();
      return result.coupons || [];
    } catch (error) {
      console.error('Could not fetch coupons:', error);
      return [];
    }
  },

  // ── Validate a coupon via backend ───────────────────────
  async validateCoupon(code, totalAmount) {
    try {
      const response = await fetch(`${this.BACKEND}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, totalAmount }),
      });
      return await response.json();
    } catch (error) {
      console.error('Could not validate coupon:', error);
      return { success: false, message: 'Could not connect to server' };
    }
  },

  // ── Fetch orders from backend ───────────────────────────
  async getOrders(userId = null) {
    try {
      const url = userId
        ? `${this.BACKEND}/api/orders?userId=${userId}`
        : `${this.BACKEND}/api/orders`;

      const response = await fetch(url);
      const result = await response.json();
      return result.orders || [];

    } catch (error) {
      console.error('Could not fetch orders:', error);
      return [];
    }
  },

  // ── Fetch single order ──────────────────────────────────
  async getOrder(orderId) {
    try {
      const response = await fetch(`${this.BACKEND}/api/orders/${orderId}`);
      const result = await response.json();
      return result.order || null;
    } catch (error) {
      console.error('Could not fetch order:', error);
      return null;
    }
  },

  // ── Add menu item (manager) ─────────────────────────────
  async addMenuItem(item) {
    try {
      const response = await fetch(`${this.BACKEND}/api/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return await response.json();
    } catch (error) {
      console.error('Could not add menu item:', error);
      return { success: false, message: 'Could not connect to server' };
    }
  },

  // ── Update menu item (manager) ──────────────────────────
  async updateMenuItem(id, updates) {
    try {
      const response = await fetch(`${this.BACKEND}/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.error('Could not update menu item:', error);
      return { success: false, message: 'Could not connect to server' };
    }
  },

  // ── Delete menu item (manager) ──────────────────────────
  async deleteMenuItem(id) {
    try {
      const response = await fetch(`${this.BACKEND}/api/menu/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Could not delete menu item:', error);
      return { success: false, message: 'Could not connect to server' };
    }
  },

  // ── Keep these for any pages still using local user data ─
  getUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('campusFoodData') || '{}').users || [];
    return users.find(u => u.email === email);
  },

  getUserById(id) {
    const users = JSON.parse(localStorage.getItem('campusFoodData') || '{}').users || [];
    return users.find(u => u.id === id);
  },

};