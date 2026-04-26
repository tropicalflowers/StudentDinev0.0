const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');

// Validation patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLL_NUMBER_REGEX = /^[A-Za-z0-9]{4,20}$/;

const DEFAULT_USERS = require(path.join(__dirname, '../data/users.json'));

async function seedDefaultUsersIfEmpty() {
  const userCount = await User.estimatedDocumentCount();
  if (userCount > 0) return;

  const seedUsers = DEFAULT_USERS
    .filter(user => user.email && user.rollNumber && user.password && user.name)
    .map(user => ({
      email: String(user.email).toLowerCase(),
      rollNumber: String(user.rollNumber).toUpperCase(),
      name: user.name,
      password: user.password,
      role: ['student', 'hosteller', 'manager'].includes(user.role) ? user.role : 'student',
      wallet: Number.isFinite(user.wallet) ? user.wallet : 500,
    }));

  for (const user of seedUsers) {
    await User.create(user);
  }

  if (seedUsers.length > 0) console.log(`Seeded ${seedUsers.length} default users`);
}

// Generate JWT Token with enhanced security
function generateToken(userId) {
  return jwt.sign(
    { userId, iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Sanitize input to prevent injection attacks
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

// POST /api/auth/register
async function register(req, res) {
  try {
    await seedDefaultUsersIfEmpty();

    let { email, rollNumber, name, password, role } = req.body;

    // Sanitize inputs
    email = sanitizeInput(email)?.toLowerCase();
    rollNumber = sanitizeInput(rollNumber)?.toUpperCase();
    name = sanitizeInput(name);
    role = sanitizeInput(role) || 'student';

    // Comprehensive validation
    if (!name || name.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full name is required (minimum 2 characters)' 
      });
    }

    if (name.length > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name is too long' 
      });
    }

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    if (!rollNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Roll number is required' 
      });
    }

    if (!ROLL_NUMBER_REGEX.test(rollNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Roll number must be 4-20 alphanumeric characters' 
      });
    }

    if (!password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password is required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    if (password.length > 128) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password is too long' 
      });
    }

    // Validate role (prevent manager role from being set via registration)
    if (!['student', 'hosteller'].includes(role)) {
      role = 'student';
    }

    // Check if user already exists (with specific error messages)
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists' 
      });
    }

    const existingRollNumber = await User.findOne({ rollNumber });
    if (existingRollNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this roll number already exists' 
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const newUser = await User.create({
      email,
      rollNumber,
      name,
      password,
      role,
      wallet: 500,
    });

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Student Dine.',
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        message: `An account with this ${field} already exists` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again later.' 
    });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    await seedDefaultUsersIfEmpty();

    let { identifier, password } = req.body;

    // Sanitize and validate
    identifier = sanitizeInput(identifier)?.toLowerCase();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email or roll number',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your password',
      });
    }

    // Find user by email or roll number (case-insensitive for roll number)
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { rollNumber: identifier.toUpperCase() }
      ],
    });

    // Use generic message to prevent user enumeration
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email/roll number or password' 
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email/roll number or password' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again later.' 
    });
  }
}

// GET /api/auth/me - Get current user profile
async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Could not fetch profile' 
    });
  }
}

// POST /api/auth/refresh - Refresh JWT token
async function refreshToken(req, res) {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Could not refresh token' 
    });
  }
}

module.exports = { register, login, getProfile, refreshToken };
