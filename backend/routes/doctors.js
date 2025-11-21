const express = require('express');
const router = express.Router();
const { auth, authorizeRole } = require('../middleware/auth');
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');

// Public or protected routes
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

// Protected routes (admin/doctor only)
router.post('/', auth, authorizeRole('admin'), createDoctor);
router.put('/:id', auth, authorizeRole('admin'), updateDoctor);
router.delete('/:id', auth, authorizeRole('admin'), deleteDoctor);

module.exports = router;
