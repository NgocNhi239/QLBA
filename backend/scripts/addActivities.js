const { Activity } = require('../models');

const addActivities = async () => {
  try {
    console.log('Adding activities...');
    
    const now = new Date();
    const activities = [
      {
        type: 'login',
        description: 'Admin đăng nhập vào hệ thống',
        user: 'admin@qlba.local',
        details: 'Login thành công',
        ipAddress: '127.0.0.1',
        timestamp: new Date(now - 5 * 60000) // 5 minutes ago
      },
      {
        type: 'report',
        description: 'Generated statistics report',
        user: 'admin@qlba.local',
        details: 'System statistics retrieved',
        ipAddress: '127.0.0.1',
        timestamp: new Date(now - 3 * 60000) // 3 minutes ago
      },
      {
        type: 'report',
        description: 'Generated statistics report',
        user: 'admin@qlba.local',
        details: 'System statistics retrieved',
        ipAddress: '127.0.0.1',
        timestamp: new Date(now - 1 * 60000) // 1 minute ago
      },
      {
        type: 'settings',
        description: 'Updated system settings',
        user: 'admin@qlba.local',
        details: 'System settings modified',
        ipAddress: '127.0.0.1',
        timestamp: new Date(now - 30000) // 30 seconds ago
      }
    ];

    for (const activity of activities) {
      await Activity.create(activity);
    }

    console.log('✅ Activities added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addActivities();
