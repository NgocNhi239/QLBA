const { User, Doctor, Patient, MedicalRecord, Prescription, LabTest, Appointment, Activity, sequelize } = require('../models');
const { Op } = require('sequelize');

// Helper: Log activity
const logActivity = async (type, description, user, details, ipAddress) => {
  try {
    await Activity.create({
      type,
      description,
      user,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Helper: Get client IP
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
};

// Get doctor dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const doctor = await Doctor.findOne({ where: { userId: userId } });
    
    // Return default stats if doctor profile not found
    if (!doctor) {
      return res.json({
        success: true,
        data: {
          totalPatients: 0,
          todayAppointments: 0,
          pendingAppointments: 0,
          completedAppointments: 0,
          totalPrescriptions: 0,
          totalLabTests: 0
        }
      });
    }

    // Get stats using doctorId (from User table, not Doctor table)
    const totalPatients = await MedicalRecord.count({
      distinct: true,
      col: 'patientId',
      where: { doctorId: userId }
    });

    const todayAppointments = await Appointment.count({
      where: {
        doctorId: doctor.id,
        appointmentDate: {
          [Op.between]: [
            new Date(new Date().setHours(0, 0, 0, 0)),
            new Date(new Date().setHours(23, 59, 59, 999))
          ]
        }
      }
    });

    const pendingAppointments = await Appointment.count({
      where: {
        doctorId: doctor.id,
        status: 'pending'
      }
    });

    const completedAppointments = await Appointment.count({
      where: {
        doctorId: doctor.id,
        status: 'confirmed'
      }
    });

    // Simplified prescription count
    const prescriptions = await Prescription.findAll({
      include: [{
        model: MedicalRecord,
        as: 'medicalRecord',
        where: { doctorId: userId },
        required: true,
        attributes: []
      }],
      attributes: ['id'],
      raw: true
    });
    const totalPrescriptions = prescriptions.length || 0;

    // Simplified lab test count
    const labTests = await LabTest.findAll({
      include: [{
        model: MedicalRecord,
        as: 'medicalRecord',
        where: { doctorId: userId },
        required: true,
        attributes: []
      }],
      attributes: ['id'],
      raw: true
    });
    const totalLabTests = labTests.length || 0;

    await logActivity(
      'view',
      'Viewed doctor dashboard',
      req.user.email,
      'Dashboard accessed',
      getClientIp(req)
    );

    res.json({
      success: true,
      data: {
        totalPatients,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        totalPrescriptions,
        totalLabTests
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.json({
      success: true,
      data: {
        totalPatients: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        totalPrescriptions: 0,
        totalLabTests: 0
      }
    });
  }
};

// Get doctor's appointments
exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const doctor = await Doctor.findOne({ where: { userId: userId } });
    if (!doctor) {
      return res.json({ success: true, data: [] });
    }

    const appointments = await Appointment.findAll({
      where: { doctorId: doctor.id },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
            }
          ],
          required: false
        }
      ],
      order: [['appointmentDate', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: appointments || []
    });
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.json({ success: true, data: [] });
  }
};

// Get doctor's patients - returns unique patients with medical records
exports.getPatients = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Get all medical records for this doctor
    const medicalRecords = await MedicalRecord.findAll({
      where: { doctorId: userId },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
            }
          ],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: medicalRecords || []
    });
  } catch (error) {
    console.error('Error getting patients:', error);
    res.json({ success: true, data: [] });
  }
};

// Get medical records for a patient
exports.getPatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const medicalRecords = await MedicalRecord.findAll({
      where: {
        patientId: patientId,
        doctorId: userId
      },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email']
            }
          ],
          required: false
        },
        {
          model: Prescription,
          as: 'prescriptions',
          required: false
        },
        {
          model: LabTest,
          as: 'labTests',
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: medicalRecords || []
    });
  } catch (error) {
    console.error('Error getting patient records:', error);
    res.json({ success: true, data: [] });
  }
};

// Create medical record
exports.createMedicalRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, primaryDiagnosis, treatment, notes, visitDate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const medicalRecord = await MedicalRecord.create({
      patientId,
      doctorId: userId,
      diagnosis,
      primaryDiagnosis,
      treatment,
      notes,
      visitDate: visitDate || new Date()
    });

    await logActivity(
      'create',
      `Created medical record for patient ${patientId}`,
      req.user.email,
      `Record ID: ${medicalRecord.id}`,
      getClientIp(req)
    );

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: medicalRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update medical record
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, primaryDiagnosis, treatment, notes } = req.body;
    const userId = req.user?.id;

    const medicalRecord = await MedicalRecord.findByPk(id);
    if (!medicalRecord || medicalRecord.doctorId !== userId) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    await medicalRecord.update({
      diagnosis: diagnosis || medicalRecord.diagnosis,
      primaryDiagnosis: primaryDiagnosis || medicalRecord.primaryDiagnosis,
      treatment: treatment || medicalRecord.treatment,
      notes: notes || medicalRecord.notes
    });

    await logActivity(
      'update',
      `Updated medical record ${id}`,
      req.user.email,
      `Changes saved`,
      getClientIp(req)
    );

    res.json({
      success: true,
      message: 'Medical record updated successfully',
      data: medicalRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create prescription
exports.createPrescription = async (req, res) => {
  try {
    const { medicalRecordId, patientId, medicationName, dosage, frequency, duration, instructions } = req.body;
    const userId = req.user?.id;

    // Verify doctor owns the medical record
    const medicalRecord = await MedicalRecord.findByPk(medicalRecordId);
    if (!medicalRecord || medicalRecord.doctorId !== userId) {
      return res.status(404).json({ success: false, message: 'Medical record not found' });
    }

    const prescription = await Prescription.create({
      medicalRecordId,
      patientId,
      medicationName,
      dosage,
      frequency,
      duration,
      instructions
    });

    await logActivity(
      'create',
      `Created prescription for patient ${patientId}`,
      req.user.email,
      `Medication: ${medicationName}`,
      getClientIp(req)
    );

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create lab test
exports.createLabTest = async (req, res) => {
  try {
    const { medicalRecordId, patientId, testName, description } = req.body;
    const userId = req.user?.id;

    // Verify doctor owns the medical record
    const medicalRecord = await MedicalRecord.findByPk(medicalRecordId);
    if (!medicalRecord || medicalRecord.doctorId !== userId) {
      return res.status(404).json({ success: false, message: 'Medical record not found' });
    }

    const labTest = await LabTest.create({
      medicalRecordId,
      patientId,
      testName,
      description,
      status: 'pending'
    });

    await logActivity(
      'create',
      `Created lab test for patient ${patientId}`,
      req.user.email,
      `Test: ${testName}`,
      getClientIp(req)
    );

    res.status(201).json({
      success: true,
      message: 'Lab test created successfully',
      data: labTest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    const doctor = await Doctor.findOne({ where: { userId: userId } });
    if (!doctor) {
      return res.json({ success: false, message: 'Doctor profile not found', data: null });
    }

    const appointment = await Appointment.findByPk(id);

    if (!appointment || appointment.doctorId !== doctor.id) {
      return res.json({ success: false, message: 'Appointment not found', data: null });
    }

    await appointment.update({ status });

    await logActivity(
      'update',
      `Updated appointment status to ${status}`,
      req.user.email,
      `Appointment ID: ${id}`,
      getClientIp(req)
    );

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.json({ success: false, message: error.message, data: null });
  }
};
