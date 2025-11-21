const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserPreference = sequelize.define('UserPreference', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    theme: {
      type: DataTypes.STRING,
      defaultValue: 'light'
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'vi'
    },
    notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    autoBackup: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    backupFrequency: {
      type: DataTypes.STRING,
      defaultValue: 'daily'
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
    tableName: 'user_preferences',
    timestamps: false
  });

  return UserPreference;
};
