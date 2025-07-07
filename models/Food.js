const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true }, // Index for faster searching
    serving_unit: { type: String, required: true, default: 'g' },
    calories_per_unit: { type: Number, required: true },
    protein_per_unit: { type: Number, required: true },
    carbs_per_unit: { type: Number, required: true },
    fat_per_unit: { type: Number, required: true },
    micronutrients: { type: mongoose.Schema.Types.Mixed }, // Flexible for various micros
    is_veg: { type: Boolean, default: false }
});

module.exports = mongoose.model('Food', FoodSchema);
