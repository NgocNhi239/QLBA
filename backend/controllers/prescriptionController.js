const { Prescription } = require('../models');

exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll({
      where: { patientId: req.params.patientId },
      order: [['prescribedDate', 'DESC']]
    });

    res.json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    await prescription.update(req.body);

    res.json({
      success: true,
      message: 'Prescription updated successfully',
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
