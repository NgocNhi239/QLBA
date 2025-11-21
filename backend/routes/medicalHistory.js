const express = require('express');
const router = express.Router();
const { Patient, MedicalHistory } = require('../models');
const auth = require('../middleware/auth');

// Get medical history for a patient
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    let history = await MedicalHistory.findOne({
      where: { patientId }
    });

    if (!history) {
      // Create empty medical history if doesn't exist
      history = await MedicalHistory.create({
        patientId,
        pastDiseases: '',
        allergies: '',
        allergyDetails: '',
        surgeries: '',
        familyHistory: '',
        currentMedications: ''
      });
    }

    res.json({ success: true, data: history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update medical history
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const history = await MedicalHistory.findByPk(id);
    if (!history) {
      return res.status(404).json({ success: false, error: 'Medical history not found' });
    }

    await history.update(updates);
    res.json({ success: true, data: history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create medical history
router.post('/', auth, async (req, res) => {
  try {
    const { patientId, ...data } = req.body;

    const history = await MedicalHistory.create({
      patientId,
      ...data
    });

    res.json({ success: true, data: history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
