const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/DiaryEntry');
const WaterLog = require('../models/WaterLog');
const WeightLog = require('../models/WeightLog');
const mongoose = require('mongoose');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  try {
    const date = new Date(req.query.date); // e.g. 2025-07-07
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    // Nutrition summary
    const diarySummary = await DiaryEntry.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          log_date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $lookup: {
          from: 'foods',
          localField: 'food',
          foreignField: '_id',
          as: 'foodDetails'
        }
      },
      { $unwind: '$foodDetails' },
      {
        $group: {
          _id: null,
          total_calories: {
            $sum: { $multiply: ['$quantity', '$foodDetails.calories_per_unit'] }
          },
          total_protein: {
            $sum: { $multiply: ['$quantity', '$foodDetails.protein_per_unit'] }
          },
          total_carbs: {
            $sum: { $multiply: ['$quantity', '$foodDetails.carbs_per_unit'] }
          },
          total_fat: {
            $sum: { $multiply: ['$quantity', '$foodDetails.fat_per_unit'] }
          }
        }
      }
    ]);

    const nutrition = diarySummary[0] || {
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0
    };

    // Water total
    const waterLogs = await WaterLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          log_date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          total_water: { $sum: '$quantity_ml' }
        }
      }
    ]);
    const total_water = waterLogs[0]?.total_water || 0;

    // Weight (latest of the day)
    const weightLog = await WeightLog.findOne({
      user: req.user.id,
      log_date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ log_date: -1 });

    const latest_weight = weightLog?.weight_kg || null;

    res.json({
      date: req.query.date,
      ...nutrition,
      total_water,
      latest_weight
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
