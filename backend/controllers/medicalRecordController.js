const { MedicalRecord, User } = require('../models');

exports.getMedicalRecordsByPatient = async (req, res) => {
  try {
    const records = await MedicalRecord.findAll({
      where: { patientId: req.params.patientId },
      include: [{
        model: User,
        as: 'doctor',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['visitDate', 'DESC']]
    });

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'doctor',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      ...req.body,
      doctorId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    await record.update(req.body);

    res.json({
      success: true,
      message: 'Medical record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
