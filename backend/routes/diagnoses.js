const express = require('express');
const router = express.Router();

// Placeholder for diagnoses routes
router.get('/', (req, res) => {
  res.json({ message: 'Diagnoses API' });
});

module.exports = router;
