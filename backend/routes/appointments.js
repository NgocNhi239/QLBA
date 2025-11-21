const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { Appointment, Doctor, Patient, User } = require('../models');
const { Op } = require('sequelize');

// Get all appointments for doctor
router.get('/doctor', auth, authorize('doctor'), async (req, res) => {
  try {
    const doctorId = req.user.id;
    const doctor = await Doctor.findOne({ where: { userId: doctorId } });
    
    if (!doctor) {
      return res.json({ success: true, data: [] });
    }

    const appointments = await Appointment.findAll({
      where: { doctorId: doctor.id },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email', 'phone']
          }],
          required: false
        }
      ],
      order: [['appointmentDate', 'DESC']]
    });

    res.json({
      success: true,
      data: appointments || []
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.json({
      success: true,
      data: []
    });
  }
});

// Get appointments for patient
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.params.patientId },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email']
          }]
        }
      ],
      order: [['appointmentDate', 'DESC']]
    });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get appointment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email', 'phone']
          }]
        },
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email', 'phone']
          }]
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create appointment
router.post('/', auth, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, reason, notes, status } = req.body;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      reason,
      notes,
      status: status || 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update appointment
router.put('/:id', auth, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await appointment.update(req.body);

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete appointment
router.delete('/:id', auth, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await appointment.destroy();

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
