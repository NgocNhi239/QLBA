const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SystemLog = sequelize.define('SystemLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('INFO', 'WARNING', 'ERROR', 'DEBUG'),
      defaultValue: 'INFO'
    },
    user: {
      type: DataTypes.STRING,
      allowNull: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'system_logs'
  });

  return SystemLog;
};
