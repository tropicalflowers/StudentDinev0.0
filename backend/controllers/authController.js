const { readData, writeData } = require('../helpers/fileHelper');

// POST /api/auth/register
function register(req, res) {
  const { email, rollNumber, name, password, role } = req.body;

  // Basic validation
  if (!email || !name || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const users = readData('users.json');

  // Check if user already exists
  const exists = users.find(u => u.email === email || (rollNumber && u.rollNumber === rollNumber));
  if (exists) {
    return res.status(400).json({ success: false, message: 'User already exists with this email or roll number' });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    rollNumber,
    name,
    password,   // Note: in production use bcrypt to hash this!
    role: role || 'student',
    wallet: 500,
    createdAt: new Date().toISOString().split('T')[0],
  };

  users.push(newUser);
  writeData('users.json', users);

  // Don't send password back
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ success: true, message: 'Registration successful', user: userWithoutPassword });
}

// POST /api/auth/login
function login(req, res) {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Email/roll number and password are required' });
  }

  const users = readData('users.json');

  // Find by email or roll number
  const user = users.find(u => u.email === identifier || u.rollNumber === identifier);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  // Don't send password back
  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, message: `Welcome, ${user.name}!`, user: userWithoutPassword });
}

module.exports = { register, login };