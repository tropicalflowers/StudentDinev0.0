const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { email, rollNumber, name, password, role } = req.body;

    // Validation
    if (!email || !name || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email or roll number' });
    }

    // Create new user (password will be hashed by pre-save hook)
    const newUser = await User.create({
      email,
      rollNumber,
      name,
      password,
      role: role || 'student',
      wallet: 500,
    });

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/roll number and password are required',
      });
    }

    // Find user by email or roll number
    const user = await User.findOne({
      $or: [{ email: identifier }, { rollNumber: identifier }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Welcome, ${user.name}!`,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { register, login };
