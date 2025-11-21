const express = require('express');
const router = express.Router();
const { auth, authorizeRole } = require('../middleware/auth');
const {
  getDashboardStats,
  getAppointments,
  getPatients,
  getPatientRecords,
  createMedicalRecord,
  updateMedicalRecord,
  createPrescription,
  createLabTest,
  updateAppointmentStatus
} = require('../controllers/doctorDashboardController');

// All routes require doctor role
router.use(auth, authorizeRole('doctor'));

// Dashboard
router.get('/stats', getDashboardStats);

// Appointments
router.get('/appointments', getAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Patients
router.get('/patients', getPatients);
router.get('/patients-list', getPatients); // Alias
router.get('/patients/:patientId/records', getPatientRecords);
router.get('/patient-records/:patientId', getPatientRecords); // Alias

// Medical Records
router.post('/medical-records', createMedicalRecord);
router.put('/medical-records/:id', updateMedicalRecord);

// Prescriptions
router.post('/prescriptions', createPrescription);

// Lab Tests
router.post('/lab-tests', createLabTest);

module.exports = router;
