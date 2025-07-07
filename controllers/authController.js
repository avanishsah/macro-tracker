const User = require('../models/User');
const jwt  = require('jsonwebtoken');

// Helper: create JWT
const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.registerUser = async (req, res) => {
    console.log('req.body:', req.body);
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    const token = createToken(user._id);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');
    const token = createToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
