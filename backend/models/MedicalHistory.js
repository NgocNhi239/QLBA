const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MedicalHistory = sequelize.define('MedicalHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    // Past Medical Conditions
    pastDiseases: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Các bệnh lý cũ (phân tách bằng dấu phẩy)'
    },
    // Allergies
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Dị ứng (phân tách bằng dấu phẩy)'
    },
    allergyDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Chi tiết dị ứng'
    },
    // Past Surgeries
    surgeries: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Các cuộc phẫu thuật trước'
    },
    // Family History
    familyHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Tiền sử gia đình (bệnh lý gia đình)'
    },
    // Medications
    currentMedications: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Các thuốc đang dùng'
    },
    // Social History
    smoker: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Có hút thuốc'
    },
    alcohol: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Có uống rượu'
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nghề nghiệp'
    },
    // Vaccinations
    vaccinations: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Lịch tiêm chủng (JSON format)'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ghi chú khác'
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
    tableName: 'medical_histories',
    timestamps: true
  });

  return MedicalHistory;
};
