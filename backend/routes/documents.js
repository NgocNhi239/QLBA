const express = require('express');
const router = express.Router();
const { Patient, PatientDocument, MedicalRecord } = require('../models');
const auth = require('../middleware/auth');

// Get all documents for a patient
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;

    const documents = await PatientDocument.findAll({
      where: { patientId },
      order: [['uploadDate', 'DESC']]
    });

    res.json({ success: true, data: documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get documents for a specific medical record
router.get('/record/:medicalRecordId', auth, async (req, res) => {
  try {
    const { medicalRecordId } = req.params;

    const documents = await PatientDocument.findAll({
      where: { medicalRecordId },
      order: [['uploadDate', 'DESC']]
    });

    res.json({ success: true, data: documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create document
router.post('/', auth, async (req, res) => {
  try {
    const { patientId, medicalRecordId, title, description, fileUrl, fileName, documentType, examDate, mimeType, fileSize } = req.body;

    if (!patientId || !fileUrl || !fileName) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const document = await PatientDocument.create({
      patientId,
      medicalRecordId,
      title: title || fileName,
      description,
      fileUrl,
      fileName,
      documentType: documentType || 'other',
      examDate,
      mimeType,
      fileSize,
      uploadedBy: req.user?.id,
      uploadDate: new Date(),
      status: 'pending'
    });

    res.json({ success: true, data: document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update document
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const document = await PatientDocument.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    await document.update(updates);
    res.json({ success: true, data: document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await PatientDocument.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    await document.destroy();
    res.json({ success: true, message: 'Document deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
