const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { rewardSavePost, rewardReportPost, rewardProfileCompletion } = require('../utils/creditUtils');
const User = require('../models/User');
const Report = require('../models/Report');

// Save a post
router.post('/save', authMiddleware, async (req, res) => {
  const post = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadySaved = user.savedPosts.some(p => p.url === post.url);
    if (alreadySaved) {
      return res.status(400).json({ error: 'Post already saved' });
    }

    user.savedPosts.push(post);
    await user.save();

    const rewardSaved = await rewardSavePost(user);
    if (!rewardSaved) {
      return res.status(500).json({ error: 'Error rewarding save post' });
    }

    res.json({ message: 'Post saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Report a post
router.post('/report', authMiddleware, async (req, res) => {
  const { post } = req.body;

  try {
    const report = new Report({
      post,
      reportedBy: req.user._id,
    });

    await report.save();

    const user = await User.findById(req.user._id);
    const rewardReported = await rewardReportPost(user);
    if (!rewardReported) {
      return res.status(500).json({ error: 'Error rewarding report post' });
    }

    res.json({ message: 'Post reported successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete profile
router.put('/complete-profile', authMiddleware, async (req, res) => {
  const { name, bio } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name;
    user.bio = bio;
    await user.save();

    const rewardCompleted = await rewardProfileCompletion(user);
    if (!rewardCompleted) {
      return res.status(500).json({ error: 'Error rewarding profile completion' });
    }

    res.json({ message: 'Profile updated and credits awarded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('credits savedPosts recentActivity');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      credits: user.credits || 0,
      savedFeeds: user.savedPosts || [],
      recentActivity: user.recentActivity || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
