const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const User = require('../models/User');
const Report = require('../models/Report');
const { rewardSavePost } = require('../utils/creditUtils');
// ==============================
// Save a Post (Authenticated)
// ==============================
router.post('/save', authMiddleware, async (req, res) => {
  const { id } = req.user;
  const post = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadySaved = user.savedPosts?.some(p => p.url === post.url);
    if (alreadySaved) {
      return res.status(400).json({ error: 'Post already saved' });
    }

    user.savedPosts.push(post);
    await user.save();

    await rewardSavePost(user); 

    res.status(200).json({ message: 'Post saved successfully' });
  } catch (err) {
    console.error('[ERROR] Saving post:', err);
    res.status(500).json({ error: 'Internal server error while saving post' });
  }
});

// ===============================
// Report a Post (Authenticated)
// ===============================
router.post('/report', authMiddleware, async (req, res) => {
  const { post } = req.body;
  const { id } = req.user;

  if (!post || !post.url) {
    return res.status(400).json({ error: 'Invalid post data' });
  }

  try {
    const report = new Report({
      post,
      reportedBy: id,
    });

    await report.save();
    res.status(200).json({ message: 'Post reported successfully' });
  } catch (err) {
    console.error('[ERROR] Reporting post:', err);
    res.status(500).json({ error: 'Internal server error while reporting post' });
  }
});

// ===========================================
// Get All Reported Posts (Admin Only Access)
// ===========================================
router.get('/reports', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error('[ERROR] Fetching reports:', err);
    res.status(500).json({ error: 'Internal server error while fetching reports' });
  }
});

module.exports = router;
