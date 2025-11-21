const express = require('express');
const router = express.Router();
const { 
  getPrescriptionsByPatient, 
  createPrescription, 
  updatePrescription 
} = require('../controllers/prescriptionController');
const { auth, authorize } = require('../middleware/auth');

// IMPORTANT: GET / must be BEFORE /patient/:patientId and /:id to avoid conflicts
// Get all prescriptions for doctor
router.get('/', auth, async (req, res) => {
  try {
    const { Prescription, MedicalRecord, Patient, User } = require('../models');
    const prescriptions = await Prescription.findAll({
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
      data: prescriptions || []
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.json({
      success: true,
      data: []
    });
  }
});

// Get prescriptions by patient
router.get('/patient/:patientId', auth, getPrescriptionsByPatient);
// Get single prescription by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { Prescription } = require('../models');
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.post('/', auth, authorize('doctor'), createPrescription);
router.put('/:id', auth, authorize('doctor'), updatePrescription);
router.delete('/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const { Prescription } = require('../models');
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    await prescription.destroy();
    res.json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
