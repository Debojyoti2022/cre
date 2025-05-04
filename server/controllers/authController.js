const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { rewardDailyLogin, rewardProfileCompletion } = require('../utils/creditUtils');

// Register a user or admin
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate role
    const validRoles = ['User', 'Admin'];
    const userRole = validRoles.includes(role) ? role : 'User';

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole,
    });

    const profileRewarded = await rewardProfileCompletion(user);
    if (!profileRewarded) {
      console.error('Error rewarding profile completion');
    }

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login a user or admin
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate ? user.lastLoginDate.toDateString() : null;

    if (lastLogin !== today) {
      user.credits += 10;
      user.lastLoginDate = new Date();
      await user.save();
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits,
        lastLoginDate: user.lastLoginDate,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
