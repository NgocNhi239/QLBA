const { Patient, User } = require('../models');

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    // First try to find by Patient ID
    let patient = await Patient.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'address']
      }]
    });

    // If not found by Patient ID, try to find by User ID
    if (!patient) {
      patient = await Patient.findOne({
        where: { userId: req.params.id },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'address']
        }]
      });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { userId, medicalRecordNumber, dateOfBirth, gender, bloodType } = req.body;

    const patient = await Patient.create({
      userId,
      medicalRecordNumber,
      dateOfBirth,
      gender,
      bloodType
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.update(req.body);

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
