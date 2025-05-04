const { rewardInteraction } = require('../utils/creditUtils');

// In savePost and reportPost functions:
await rewardInteraction(req.user); 