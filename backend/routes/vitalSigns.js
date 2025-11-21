const express = require('express');
const router = express.Router();
const { MedicalRecord, VitalSigns } = require('../models');
const auth = require('../middleware/auth');

// Get vital signs for a medical record
router.get('/record/:medicalRecordId', auth, async (req, res) => {
  try {
    const { medicalRecordId } = req.params;

    const vitalSigns = await VitalSigns.findOne({
      where: { medicalRecordId }
    });

    res.json({ success: true, data: vitalSigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create or update vital signs
router.post('/', auth, async (req, res) => {
  try {
    const { medicalRecordId, ...data } = req.body;

    // Check if vital signs already exist for this record
    let vitalSigns = await VitalSigns.findOne({
      where: { medicalRecordId }
    });

    if (vitalSigns) {
      // Update existing
      await vitalSigns.update(data);
    } else {
      // Create new
      vitalSigns = await VitalSigns.create({
        medicalRecordId,
        ...data
      });
    }

    res.json({ success: true, data: vitalSigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update vital signs
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vitalSigns = await VitalSigns.findByPk(id);
    if (!vitalSigns) {
      return res.status(404).json({ success: false, error: 'Vital signs not found' });
    }

    await vitalSigns.update(updates);
    res.json({ success: true, data: vitalSigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
