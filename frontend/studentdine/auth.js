/**
 * Campus Food - Authentication System
 * Connected to backend API
 * Supports JWT tokens and real-time updates via Socket.io
 */

const Auth = {
  // Dynamic backend URL - works in development and production
  BACKEND: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || !window.location.hostname
    ? 'http://localhost:3000' 
    : `${window.location.protocol}//${window.location.hostname}:3000`,
  SOCKET_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || !window.location.hostname
    ? 'http://localhost:3000' 
    : `${window.location.protocol}//${window.location.hostname}:3000`,
  currentUser: null,
  token: null,
  socket: null,
  SESSION_TIMEOUT: 30 * 60 * 1000,
  sessionTimer: null,
  isLoading: false,

  // Validation patterns
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ROLL_NUMBER_REGEX: /^[A-Za-z0-9]{4,20}$/,

  // Initialize session from localStorage
  init() {
    const savedUser = localStorage.getItem('campusFoodCurrentUser');
    const savedToken = localStorage.getItem('campusFoodToken');
    
    if (savedUser && savedToken) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.token = savedToken;
        
        // Validate token is not expired
        if (this.isTokenExpired(savedToken)) {
          console.warn('Token expired, logging out');
          this.logout(false); // Don't redirect
          return;
        }
        
        this.resetSessionTimer();
        this.initializeSocket();
      } catch (e) {
        console.error('Failed to restore session:', e);
        this.logout(false);
      }
    }
  },

  // Check if JWT token is expired
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  },

  // Sanitize input to prevent XSS
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  },

  // Validate email format
  validateEmail(email) {
    if (!email) return { valid: false, message: 'Email is required' };
    if (!this.EMAIL_REGEX.test(email)) return { valid: false, message: 'Please enter a valid email address' };
    return { valid: true };
  },

  // Validate password strength
  validatePassword(password) {
    if (!password) return { valid: false, message: 'Password is required' };
    if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters' };
    if (password.length > 128) return { valid: false, message: 'Password is too long' };
    return { valid: true };
  },

  // Validate roll number
  validateRollNumber(rollNumber) {
    if (!rollNumber) return { valid: false, message: 'Roll number is required' };
    if (!this.ROLL_NUMBER_REGEX.test(rollNumber)) {
      return { valid: false, message: 'Roll number must be 4-20 alphanumeric characters' };
    }
    return { valid: true };
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
    if (this.isLoading) {
      return { success: false, message: 'Please wait...' };
    }

    const { email, rollNumber, name, password, passwordConfirm, role } = data;

    // Sanitize inputs
    const sanitizedData = {
      email: this.sanitizeInput(email?.toLowerCase()),
      rollNumber: this.sanitizeInput(rollNumber?.toUpperCase()),
      name: this.sanitizeInput(name),
      password: password, // Don't sanitize password
      role: this.sanitizeInput(role) || 'student'
    };

    // Comprehensive validation
    const nameValidation = this.validateName(sanitizedData.name);
    if (!nameValidation.valid) return { success: false, message: nameValidation.message };

    const emailValidation = this.validateEmail(sanitizedData.email);
    if (!emailValidation.valid) return { success: false, message: emailValidation.message };

    const rollValidation = this.validateRollNumber(sanitizedData.rollNumber);
    if (!rollValidation.valid) return { success: false, message: rollValidation.message };

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) return { success: false, message: passwordValidation.message };

    if (password !== passwordConfirm) {
      return { success: false, message: 'Passwords do not match' };
    }

    if (!['student', 'hosteller', 'manager'].includes(sanitizedData.role)) {
      return { success: false, message: 'Please select a valid role' };
    }

    // Call backend
    this.isLoading = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${this.BACKEND}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();
      
      if (result.success && result.token) {
        this.setSession(result.user, result.token);
      }

      return result;

    } catch (error) {
      console.error('Register error:', error);
      if (error.name === 'AbortError') {
        return { success: false, message: 'Request timed out. Please try again.' };
      }
      return { success: false, message: 'Could not connect to server. Please check your internet connection.' };
    } finally {
      this.isLoading = false;
    }
  },

  // Validate name
  validateName(name) {
    if (!name) return { valid: false, message: 'Full name is required' };
    if (name.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
    if (name.length > 100) return { valid: false, message: 'Name is too long' };
    return { valid: true };
  },

  // Login user — calls backend POST /api/auth/login
  async login(identifier, password) {
    if (this.isLoading) {
      return { success: false, message: 'Please wait...' };
    }

    // Validate inputs
    if (!identifier || !identifier.trim()) {
      return { success: false, message: 'Please enter your email or roll number' };
    }

    if (!password) {
      return { success: false, message: 'Please enter your password' };
    }

    const sanitizedIdentifier = this.sanitizeInput(identifier.trim().toLowerCase());

    this.isLoading = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${this.BACKEND}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: sanitizedIdentifier, password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (result.success && result.token) {
        this.setSession(result.user, result.token);
      }

      return result;

    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'AbortError') {
        return { success: false, message: 'Request timed out. Please try again.' };
      }
      return { success: false, message: 'Could not connect to server. Please check your internet connection.' };
    } finally {
      this.isLoading = false;
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

  // Logout user — comprehensive cleanup
  logout(redirect = true) {
    this.currentUser = null;
    this.token = null;
    this.isLoading = false;

    // Clear timers
    clearTimeout(this.sessionTimer);

    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Clear all auth-related localStorage items
    const authKeys = [
      'campusFoodCurrentUser',
      'campusFoodToken',
      'campusFoodCart',           // Shopping cart
      'campusFoodData',           // Cached data
      'campus_food_role',         // Role selection
      'campus_food_bypass_login', // Dev bypass flag
      'campus_food_user_name',    // Dev user data
      'campus_food_user_roll',    // Dev user data
    ];
    authKeys.forEach(key => localStorage.removeItem(key));

    // Clear all sessionStorage items (session-specific data)
    sessionStorage.clear();

    // Dispatch custom event for pages to listen to logout (let them clean up, not redirect)
    window.dispatchEvent(new CustomEvent('authLogout', { detail: { timestamp: Date.now() } }));

    if (redirect) {
      // Handle different page locations - use replace() to prevent back button issues
      const currentPath = window.location.pathname;
      if (currentPath.includes('/auth/')) {
        window.location.replace('login.html');
      } else if (currentPath.includes('/hosteller/') || currentPath.includes('/manager/') || currentPath.includes('/day-scholar/')) {
        window.location.replace('../auth/login.html');
      } else {
        // Root or other pages - redirect to auth/login.html
        window.location.replace('auth/login.html');
      }
    }
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

  // Clear all auth-related form data from localStorage/sessionStorage
  clearFormData() {
    const formKeys = [
      'campusFoodFormState',
      'lastUserEmail',
      'lastUserId',
    ];
    formKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  },

  // Validate and restore session (called on init)
  validateSession() {
    if (!this.isAuthenticated()) return false;
    
    if (this.isTokenExpired(this.token)) {
      console.warn('Token expired during session validation');
      this.logout(false);
      return false;
    }
    return true;
  },

  // Update wallet balance locally (will be handled by backend in future)
  updateWallet(userId, amount) {
    if (this.currentUser && (this.currentUser.id === userId || this.currentUser._id === userId)) {
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
