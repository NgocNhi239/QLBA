const { User, Patient, syncDatabase } = require('./models');

const seedData = async () => {
  try {
    console.log('Starting to seed data...');

    // Tạo admin user
    const admin = await User.create({
      email: 'admin@qlba.local',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'System',
      role: 'admin'
    });
    console.log('✓ Admin user created');

    // Tạo doctor user
    const doctor = await User.create({
      email: 'doctor@qlba.local',
      password: 'doctor123',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      role: 'doctor',
      phone: '0901234567'
    });
    console.log('✓ Doctor user created');

    // Tạo patient users
    const patient1 = await User.create({
      email: 'patient1@qlba.local',
      password: 'patient123',
      firstName: 'Trần',
      lastName: 'Văn B',
      role: 'patient',
      phone: '0987654321'
    });
    console.log('✓ Patient 1 user created');

    const patient2 = await User.create({
      email: 'patient2@qlba.local',
      password: 'patient123',
      firstName: 'Lê',
      lastName: 'Thị C',
      role: 'patient',
      phone: '0912345678'
    });
    console.log('✓ Patient 2 user created');

    // Tạo patient records
    await Patient.create({
      userId: patient1.id,
      medicalRecordNumber: 'BN001',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      bloodType: 'O+',
      allergies: 'Penicillin',
      insurance: 'BHYT 123456'
    });
    console.log('✓ Patient 1 record created');

    await Patient.create({
      userId: patient2.id,
      medicalRecordNumber: 'BN002',
      dateOfBirth: '1985-03-20',
      gender: 'female',
      bloodType: 'A+',
      allergies: 'None',
      insurance: 'BHYT 654321'
    });
    console.log('✓ Patient 2 record created');

    console.log('\n✓ Seed data created successfully!');
    console.log('\nTest accounts:');
    console.log('Admin:   admin@qlba.local / admin123');
    console.log('Doctor:  doctor@qlba.local / doctor123');
    console.log('Patient1: patient1@qlba.local / patient123');
    console.log('Patient2: patient2@qlba.local / patient123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Sync DB then seed data
syncDatabase().then(() => seedData());
