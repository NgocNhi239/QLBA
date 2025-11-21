const { LabTest } = require('../models');

exports.getLabTestsByPatient = async (req, res) => {
  try {
    const tests = await LabTest.findAll({
      where: { patientId: req.params.patientId },
      order: [['orderedDate', 'DESC']]
    });

    res.json({
      success: true,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createLabTest = async (req, res) => {
  try {
    const test = await LabTest.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Lab test created successfully',
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateLabTest = async (req, res) => {
  try {
    const test = await LabTest.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }

    await test.update(req.body);

    res.json({
      success: true,
      message: 'Lab test updated successfully',
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
