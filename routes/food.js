const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// POST /api/foods → Add new food
router.post('/', async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/foods → List all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
