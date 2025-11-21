const { UserPreference, User } = require('../models');

// Get user preferences
exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let preferences = await UserPreference.findOne({ where: { userId } });
    
    // Tạo preference mặc định nếu chưa có
    if (!preferences) {
      preferences = await UserPreference.create({ userId });
    }

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { theme, language, emailNotifications, smsNotifications, autoBackup, backupFrequency } = req.body;

    let preferences = await UserPreference.findOne({ where: { userId } });
    
    if (!preferences) {
      preferences = await UserPreference.create({ userId });
    }

    // Update chỉ những field được gửi
    if (theme) preferences.theme = theme;
    if (language) preferences.language = language;
    if (emailNotifications !== undefined) preferences.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined) preferences.smsNotifications = smsNotifications;
    if (autoBackup !== undefined) preferences.autoBackup = autoBackup;
    if (backupFrequency) preferences.backupFrequency = backupFrequency;

    await preferences.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: preferences
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
