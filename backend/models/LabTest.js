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
  testCategory: {
    type: DataTypes.ENUM('hematology', 'biochemistry', 'coagulation', 'serology', 'urinalysis', 'microbiology', 'imaging', 'other'),
    defaultValue: 'other',
    comment: 'Nhóm xét nghiệm'
  },
  orderedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  orderedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Bác sĩ chỉ định (userId)'
  },
  performedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Ngày thực hiện xét nghiệm'
  },
  performedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Y tá/kỹ thuật viên thực hiện'
  },
  resultDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resultValue: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Kết quả xét nghiệm'
  },
  normalRange: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Giá trị tham chiếu bình thường'
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Đơn vị đo'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'abnormal'),
    defaultValue: 'pending'
  },
  interpretation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Diễn giải kết quả'
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
