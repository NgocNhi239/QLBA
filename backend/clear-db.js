const { sequelize } = require('./models');

async function clearDatabase() {
  try {
    console.log('Clearing database...');
    
    // Disable foreign key checks
    await sequelize.query('SET session_replication_role = replica;');
    
    // Truncate all tables
    const tables = [
      'activities',
      'appointments',
      'lab_tests',
      'prescriptions',
      'medical_records',
      'system_logs',
      'user_preferences',
      'doctors',
      'patients',
      'users',
      'system_settings'
    ];

    for (const table of tables) {
      try {
        await sequelize.query(`TRUNCATE TABLE "${table}" CASCADE;`);
        console.log(`✓ Cleared ${table}`);
      } catch (error) {
        console.log(`⚠ Could not clear ${table}:`, error.message);
      }
    }

    // Re-enable foreign key checks
    await sequelize.query('SET session_replication_role = default;');
    
    console.log('\n✅ Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
