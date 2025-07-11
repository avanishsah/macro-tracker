// routes/profile.js
const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);

module.exports = router;  
