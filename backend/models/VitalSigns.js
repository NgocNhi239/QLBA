const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VitalSigns = sequelize.define('VitalSigns', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    medicalRecordId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    // Blood Pressure (mmHg)
    systolicBP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Huyết áp tâm thu (mmHg)'
    },
    diastolicBP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Huyết áp tâm trương (mmHg)'
    },
    // Heart Rate (bpm)
    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Nhịp tim (lần/phút)'
    },
    // Temperature (°C)
    temperature: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
      comment: 'Nhiệt độ cơ thể (°C)'
    },
    // Respiratory Rate (breaths/min)
    respiratoryRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Nhịp thở (lần/phút)'
    },
    // Oxygen Saturation (%)
    oxygenSaturation: {
      type: DataTypes.DECIMAL(5, 1),
      allowNull: true,
      comment: 'Độ bão hòa oxy (%)'
    },
    // Physical Measurements
    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Chiều cao (cm)'
    },
    weight: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      comment: 'Cân nặng (kg)'
    },
    bmi: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Chỉ số BMI'
    },
    // Physical Examination Details
    headExam: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Khám đầu, mặt, cổ'
    },
    lungExam: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Khám phổi'
    },
    heartExam: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Khám tim'
    },
    abdomenExam: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Khám bụng'
    },
    extremitiesExam: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Khám chi'
    },
    neurologicalExam: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Khám thần kinh'
    },
    generalAppearance: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Tình trạng chung'
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: 'vital_signs',
    timestamps: true
  });

  return VitalSigns;
};
