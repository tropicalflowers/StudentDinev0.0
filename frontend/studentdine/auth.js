/**
 * Campus Food - Authentication System
 * Connected to backend API at localhost:3000
 * Supports JWT tokens and real-time updates via Socket.io
 */

const Auth = {
  BACKEND: 'http://localhost:3000',
  SOCKET_URL: 'http://localhost:3000',
  currentUser: null,
  token: null,
  socket: null,
  SESSION_TIMEOUT: 30 * 60 * 1000,
  sessionTimer: null,

  // Initialize session from localStorage
  init() {
    const savedUser = localStorage.getItem('campusFoodCurrentUser');
    const savedToken = localStorage.getItem('campusFoodToken');
    
    if (savedUser && savedToken) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.token = savedToken;
        this.resetSessionTimer();
        this.initializeSocket();
      } catch (e) {
        console.error('Failed to restore session:', e);
        this.logout();
      }
    }
  },

  // Initialize Socket.io connection for real-time updates
  initializeSocket() {
    // Load socket.io client library dynamically
    if (!window.io) {
      const script = document.createElement('script');
      script.src = `${this.SOCKET_URL}/socket.io/socket.io.js`;
      script.onload = () => {
        this.connectSocket();
      };
      document.head.appendChild(script);
    } else {
      this.connectSocket();
    }
  },

  connectSocket() {
    if (this.socket) return;
    
    this.socket = window.io(this.SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('[Socket.io] Connected');
      // Join user-specific room for order updates
      if (this.currentUser) {
        this.socket.emit('join_user_room', this.currentUser._id);
      }
    });

    this.socket.on('order_status_changed', (data) => {
      console.log('[Socket.io] Order status changed:', data);
      // Trigger custom event for pages to listen to
      window.dispatchEvent(new CustomEvent('orderStatusChanged', { detail: data }));
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected');
    });
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
      
      if (result.success && result.token) {
        this.setSession(result.user, result.token);
      }

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

      if (result.success && result.token) {
        this.setSession(result.user, result.token);
      }

      return result;

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Could not connect to server. Is the backend running?' };
    }
  },

  // Set session (used after successful login/register)
  setSession(user, token) {
    this.currentUser = user;
    this.token = token;
    localStorage.setItem('campusFoodCurrentUser', JSON.stringify(user));
    localStorage.setItem('campusFoodToken', token);
    this.resetSessionTimer();
    this.initializeSocket();
  },

  // Get authorization header with JWT token
  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  },

  // Logout user
  logout() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('campusFoodCurrentUser');
    localStorage.removeItem('campusFoodToken');
    clearTimeout(this.sessionTimer);
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    window.location.href = 'auth/login.html';
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null && this.token !== null;
  },

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  },

  // Get JWT token
  getToken() {
    return this.token;
  },

  // Update wallet balance locally (will be handled by backend in future)
  updateWallet(userId, amount) {
    if (this.currentUser && this.currentUser._id === userId) {
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
