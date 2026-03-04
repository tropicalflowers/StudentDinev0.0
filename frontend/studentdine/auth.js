/**
 * Campus Food - Authentication System
 * Connected to backend API at localhost:3000
 */

const Auth = {
  BACKEND: 'http://localhost:3000',
  currentUser: null,
  SESSION_TIMEOUT: 30 * 60 * 1000,
  sessionTimer: null,

  // Initialize session from localStorage
  init() {
    const savedUser = localStorage.getItem('campusFoodCurrentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.resetSessionTimer();
      } catch (e) {
        console.error('Failed to restore session:', e);
        this.logout();
      }
    }
  },

  // Register new user — calls backend POST /api/auth/register
  async register(data) {
    const { email, rollNumber, name, password, passwordConfirm, role } = data;

    // Frontend validation first
    if (!email || !rollNumber || !name || !password || !role) {
      return { success: false, message: 'All fields are required' };
    }

    if (password !== passwordConfirm) {
      return { success: false, message: 'Passwords do not match' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Call backend
    try {
      const response = await fetch(`${this.BACKEND}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, rollNumber, name, password, role }),
      });

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Could not connect to server. Is the backend running?' };
    }
  },

  // Login user — calls backend POST /api/auth/login
  async login(identifier, password) {
    try {
      const response = await fetch(`${this.BACKEND}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Save user to localStorage for session
        this.currentUser = result.user;
        localStorage.setItem('campusFoodCurrentUser', JSON.stringify(this.currentUser));
        this.resetSessionTimer();
      }

      return result;

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Could not connect to server. Is the backend running?' };
    }
  },

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('campusFoodCurrentUser');
    clearTimeout(this.sessionTimer);
    window.location.href = 'auth/login.html';
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  },

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  },

  // Update wallet balance locally (will be handled by backend in future)
  updateWallet(userId, amount) {
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser.wallet += amount;
      localStorage.setItem('campusFoodCurrentUser', JSON.stringify(this.currentUser));
    }
  },

  // Session timer
  resetSessionTimer() {
    clearTimeout(this.sessionTimer);
    this.sessionTimer = setTimeout(() => {
      alert('Session expired. Please login again.');
      this.logout();
    }, this.SESSION_TIMEOUT);
  },

  updateSession() {
    if (this.isAuthenticated()) {
      this.resetSessionTimer();
    }
  },
};

// Initialize auth on page load
Auth.init();

// Keep session alive on user activity
document.addEventListener('mousemove', () => Auth.updateSession());
document.addEventListener('keypress', () => Auth.updateSession());
document.addEventListener('click',     () => Auth.updateSession());