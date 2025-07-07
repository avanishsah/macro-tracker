const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const updates = req.body; // e.g., { target_calories: 1800 }
  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true, runValidators: true
  });
  res.json(user);
};
