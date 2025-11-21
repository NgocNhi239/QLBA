const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PatientDocument = sequelize.define('PatientDocument', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    medicalRecordId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Liên kết đến bệnh án (nếu có)'
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    documentType: {
      type: DataTypes.ENUM('xray', 'ct', 'ultrasound', 'ecg', 'lab_result', 'report', 'other'),
      defaultValue: 'other',
      comment: 'Loại tài liệu'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tiêu đề tài liệu'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mô tả tài liệu'
    },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Đường dẫn file (lưu URL hoặc path)'
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tên file gốc'
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Kích thước file (bytes)'
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Loại MIME (image/jpeg, application/pdf, etc)'
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User upload (userId)'
    },
    uploadDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'Ngày upload'
    },
    examDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Ngày khám/chụp'
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'archived'),
      defaultValue: 'pending',
      comment: 'Trạng thái tài liệu'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ghi chú'
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
    tableName: 'patient_documents',
    timestamps: true
  });

  return PatientDocument;
};
