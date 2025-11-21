const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SystemSettings = sequelize.define('SystemSettings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    appName: {
      type: DataTypes.STRING,
      defaultValue: 'QLBA - Electronic Health Record System'
    },
    appVersion: {
      type: DataTypes.STRING,
      defaultValue: '1.0.0'
    },
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    maxUploadSize: {
      type: DataTypes.INTEGER,
      defaultValue: 10 // MB
    },
    sessionTimeout: {
      type: DataTypes.INTEGER,
      defaultValue: 30 // minutes
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    backupEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    backupFrequency: {
      type: DataTypes.ENUM('hourly', 'daily', 'weekly', 'monthly'),
      defaultValue: 'daily'
    },
    theme: {
      type: DataTypes.ENUM('light', 'dark'),
      defaultValue: 'light'
    },
    language: {
      type: DataTypes.ENUM('vi', 'en'),
      defaultValue: 'vi'
    }
  }, {
    timestamps: true,
    tableName: 'system_settings'
  });

  return SystemSettings;
};
