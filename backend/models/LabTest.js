const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LabTest = sequelize.define('LabTest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  medicalRecordId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'medical_records',
      key: 'id'
    }
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'patients',
      key: 'id'
    }
  },
  testName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  testCode: {
    type: DataTypes.STRING
  },
  orderedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  resultDate: {
    type: DataTypes.DATE
  },
  resultValue: {
    type: DataTypes.TEXT
  },
  normalRange: {
    type: DataTypes.STRING
  },
  unit: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'abnormal'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'lab_tests',
  timestamps: false
});

module.exports = LabTest;
