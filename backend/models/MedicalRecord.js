const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'patients',
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  visitDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  visitType: {
    type: DataTypes.ENUM('initial', 'followup', 'emergency', 'routine'),
    defaultValue: 'routine',
    comment: 'Loại khám'
  },
  department: {
    type: DataTypes.STRING
  },
  reason: {
    type: DataTypes.TEXT
  },
  symptoms: {
    type: DataTypes.TEXT
  },
  clinicalExamination: {
    type: DataTypes.TEXT
  },
  physicalExamDetails: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Chi tiết khám thể lực (lưu trữ JSON hoặc text)'
  },
  diagnosis: {
    type: DataTypes.TEXT
  },
  primaryDiagnosis: {
    type: DataTypes.STRING
  },
  secondaryDiagnosis: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Các chẩn đoán phụ'
  },
  treatment: {
    type: DataTypes.TEXT
  },
  examResult: {
    type: DataTypes.TEXT
  },
  followUpRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Có cần theo dõi sau'
  },
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Ngày tái khám dự kiến'
  },
  followUpNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Hướng dẫn tái khám'
  },
  notes: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('draft', 'completed', 'archived'),
    defaultValue: 'draft'
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
  tableName: 'medical_records',
  timestamps: false
});

module.exports = MedicalRecord;
