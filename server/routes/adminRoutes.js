const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ==========================
// Admin Registration
// ==========================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // Make sure the role is 'admin'
    });

    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// Admin Login
// ==========================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid credentials or not an admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// Admin Dashboard Analytics
// ==========================
router.get('/analytics', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.find({});
    const totalUsers = users.length;
    const totalCredits = users.reduce((sum, user) => sum + (user.credits || 0), 0);
    const totalSavedPosts = users.reduce((sum, user) => sum + (user.savedPosts?.length || 0), 0);

    res.json({ totalUsers, totalCredits, totalSavedPosts });
  } catch (err) {
    res.status(500).json({ error: 'Server error while getting analytics' });
  }
});

// ==========================
// Get All Users (Admin Only)
// ==========================
router.get('/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ==========================
// Update User Credits (Admin Only)
// ==========================
router.put('/update-credits/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const { id } = req.params;
  const { credits } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.credits = credits;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error('Error updating credits:', err);
    res.status(500).json({ error: 'Server error while updating credits' });
  }
});

module.exports = router;
