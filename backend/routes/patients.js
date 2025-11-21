const express = require('express');
const router = express.Router();
const { 
  getAllPatients, 
  getPatientById, 
  createPatient, 
  updatePatient 
} = require('../controllers/patientController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getAllPatients);
router.get('/:id', auth, getPatientById);
router.post('/', auth, authorize('doctor', 'admin'), createPatient);
router.put('/:id', auth, authorize('doctor', 'admin'), updatePatient);

module.exports = router;
