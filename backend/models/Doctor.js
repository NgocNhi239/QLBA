const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'General'
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: 'LIC-' + Math.random().toString(36).substr(2, 9)
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  availableSlots: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: 'doctors',
  timestamps: false
});

module.exports = Doctor;
