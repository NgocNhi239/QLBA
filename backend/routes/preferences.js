const express = require('express');
const router = express.Router();
const { getPreferences, updatePreferences } = require('../controllers/preferenceController');
const { auth } = require('../middleware/auth');

// Get user preferences
router.get('/', auth, getPreferences);

// Update user preferences
router.put('/', auth, updatePreferences);

module.exports = router;
