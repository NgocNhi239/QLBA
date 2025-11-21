const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  medicalRecordNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATE
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other')
  },
  bloodType: {
    type: DataTypes.STRING
  },
  allergies: {
    type: DataTypes.TEXT
  },
  medicalHistory: {
    type: DataTypes.TEXT
  },
  insurance: {
    type: DataTypes.STRING
  },
  emergencyContact: {
    type: DataTypes.STRING
  },
  emergencyPhone: {
    type: DataTypes.STRING
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
  tableName: 'patients',
  timestamps: false
});

module.exports = Patient;
