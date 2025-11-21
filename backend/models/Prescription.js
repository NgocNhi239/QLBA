const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
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
  medicationName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  unit: {
    type: DataTypes.STRING
  },
  frequency: {
    type: DataTypes.STRING
  },
  duration: {
    type: DataTypes.STRING
  },
  route: {
    type: DataTypes.STRING
  },
  instructions: {
    type: DataTypes.TEXT
  },
  prescribedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expiryDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
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
  tableName: 'prescriptions',
  timestamps: false
});

module.exports = Prescription;
