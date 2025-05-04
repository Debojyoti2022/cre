const User = require('../models/User');
const Report = require('../models/Report');

const getAllUsers = async (req, res) => {
  const users = await User.find({}, 'email credits role');
  res.json(users);
};

const getFeedActivity = async (req, res) => {
  const activity = await Report.aggregate([
    { $group: { _id: "$activityType", count: { $sum: 1 } } },
    { $project: { activityType: "$_id", count: 1, _id: 0 } }
  ]);
  res.json(activity);
};

module.exports = { getAllUsers, getFeedActivity };
