const express = require('express');
const router = express.Router();
const WaterLog = require('../models/WaterLog.js');
const auth = require('../middleware/authMiddleware.js');

// POST
router.post('/', auth, async (req, res) => {
  try {
    const { quantity_ml, log_date } = req.body;

    const waterLog = new WaterLog({
      user: req.user.id,
      quantity_ml,
      log_date
    });

    await waterLog.save();
    res.status(201).json(waterLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET
router.get('/', auth, async (req, res) => {
  try {
    const logs = await WaterLog.find({ user: req.user.id }).sort({ log_date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
