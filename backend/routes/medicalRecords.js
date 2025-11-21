const express = require('express');
const router = express.Router();
const { 
  getMedicalRecordsByPatient, 
  getMedicalRecordById, 
  createMedicalRecord, 
  updateMedicalRecord 
} = require('../controllers/medicalRecordController');
const { auth, authorize } = require('../middleware/auth');

// Get all medical records for doctor (for dashboard)
router.get('/', auth, async (req, res) => {
  try {
    const { MedicalRecord, Patient, User } = require('../models');
    const records = await MedicalRecord.findAll({
      where: { doctorId: req.user.id },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email']
          }],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: records || []
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.json({
      success: true,
      data: []
    });
  }
});

router.get('/patient/:patientId', auth, getMedicalRecordsByPatient);
router.get('/:id', auth, getMedicalRecordById);
router.post('/', auth, authorize('doctor'), createMedicalRecord);
router.put('/:id', auth, authorize('doctor'), updateMedicalRecord);

module.exports = router;
