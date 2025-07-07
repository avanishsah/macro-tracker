const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/DiaryEntry');
const auth = require('../middleware/authMiddleware');  // if you have it

// POST /api/diary → log a diary entry
router.post('/', auth, async (req, res) => {
  try {
    const { food, quantity, meal_type, log_date } = req.body;

    const entry = new DiaryEntry({
      user: req.user.id,  // from JWT
      food,
      quantity,
      meal_type,
      log_date
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/diary → list all diary entries for a user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await DiaryEntry.find({ user: req.user.id })
      .populate('food');  // to show food details
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
