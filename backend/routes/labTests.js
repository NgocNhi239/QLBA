const express = require('express');
const router = express.Router();
const { 
  getLabTestsByPatient, 
  createLabTest, 
  updateLabTest 
} = require('../controllers/labTestController');
const { auth, authorize } = require('../middleware/auth');

// IMPORTANT: GET / must be BEFORE /patient/:patientId and /:id to avoid conflicts
// Get all lab tests for doctor (must be BEFORE :id route)
router.get('/', auth, async (req, res) => {
  try {
    const { LabTest, MedicalRecord, Patient, User } = require('../models');
    const tests = await LabTest.findAll({
      include: [
        {
          model: MedicalRecord,
          as: 'medicalRecord',
          where: { doctorId: req.user.id },
          required: true,
          attributes: []
        },
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
      data: tests || []
    });
  } catch (error) {
    console.error('Error fetching lab tests:', error);
    res.json({
      success: true,
      data: []
    });
  }
});

// Get prescriptions by patient
router.get('/patient/:patientId', auth, getLabTestsByPatient);

// Get single lab test by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { LabTest } = require('../models');
    const test = await LabTest.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }
    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.post('/', auth, authorize('doctor'), createLabTest);
router.put('/:id', auth, authorize('doctor'), updateLabTest);
router.delete('/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const { LabTest } = require('../models');
    const test = await LabTest.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }
    await test.destroy();
    res.json({
      success: true,
      message: 'Lab test deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
