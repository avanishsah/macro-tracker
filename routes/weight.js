const express = require('express');
const router = express.Router();
const WeightLog = require('../models/WeightLog');
const auth = require('../middleware/authMiddleware');

// POST /api/weight
router.post('/', auth, async (req, res) => {
  try {
    const { weight_kg, log_date } = req.body;

    const weightLog = new WeightLog({
      user: req.user.id,
      weight_kg,
      log_date
    });

    await weightLog.save();
    res.status(201).json(weightLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/weight
router.get('/', auth, async (req, res) => {
  try {
    const logs = await WeightLog.find({ user: req.user.id }).sort({ log_date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
