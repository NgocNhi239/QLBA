const { User, Patient, Doctor, MedicalRecord, Prescription, LabTest, SystemLog, Activity, SystemSettings } = require('../models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('🌱 Seeding database with test data...');

    // Clear existing data (optional - comment out to keep existing data)
    // await User.destroy({ where: {} });
    
    // Create Users
    let adminUser = await User.findOne({ where: { email: 'admin@qlba.local' } });
    if (!adminUser) {
      adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'QLBA',
        email: 'admin@qlba.local',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        phone: '0123456789',
        address: 'Hà Nội'
      });
      console.log('✅ Created admin user');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    let doctorUser = await User.findOne({ where: { email: 'doctor@qlba.local' } });
    if (!doctorUser) {
      doctorUser = await User.create({
        firstName: 'Nguyễn Văn',
        lastName: 'A',
        email: 'doctor@qlba.local',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        phone: '0987654321',
        address: 'TP HCM'
      });
      console.log('✅ Created doctor user');
    } else {
      console.log('ℹ️ Doctor user already exists');
    }

    // Create multiple patients
    const patientEmails = [
      'patient1@qlba.local',
      'patient2@qlba.local',
      'patient3@qlba.local',
      'patient4@qlba.local',
      'patient5@qlba.local'
    ];

    const patients = [];
    for (let i = 0; i < patientEmails.length; i++) {
      const email = patientEmails[i];
      let patientUser = await User.findOne({ where: { email } });
      if (!patientUser) {
        patientUser = await User.create({
          firstName: 'Bệnh',
          lastName: `nhân ${i + 1}`,
          email,
          password: await bcrypt.hash('password123', 10),
          role: 'patient',
          phone: `090${Math.random().toString().slice(2, 9)}`,
          address: 'Địa chỉ bệnh nhân ' + (i + 1)
        });
        console.log(`✅ Created patient ${i + 1}`);
      }

      let patient = await Patient.findOne({ where: { userId: patientUser.id } });
      if (!patient) {
        patient = await Patient.create({
          userId: patientUser.id,
          medicalRecordNumber: `MR-${Date.now()}-${i}`
        });
      }
      
      patients.push(patient);
    }

    // Create Doctor profile
    let doctor = await Doctor.findOne({ where: { userId: doctorUser.id } });
    if (!doctor) {
      doctor = await Doctor.create({
        userId: doctorUser.id,
        specialization: 'Nội khoa',
        licenseNumber: 'LIC-2024-001',
        yearsOfExperience: 15,
        availableSlots: 50,
        bio: 'Bác sĩ giàu kinh nghiệm chuyên khoa Nội khoa'
      });
      console.log('✅ Created doctor profile');
    }

    // Create Medical Records
    for (let i = 0; i < patients.length; i++) {
      const existing = await MedicalRecord.findOne({ where: { patientId: patients[i].id } });
      if (!existing) {
        await MedicalRecord.create({
          patientId: patients[i].id,
          doctorId: doctorUser.id,
          diagnosis: 'Cảm lạnh thông thường',
          treatment: 'Uống nước ấm, nghỉ ngơi 2-3 ngày',
          notes: 'Bệnh nhân cần theo dõi sốt'
        });
        console.log(`✅ Created medical record ${i + 1}`);
      }
    }

    // Create Prescriptions
    const medicalRecords = await MedicalRecord.findAll();
    for (let i = 0; i < medicalRecords.length; i++) {
      const existing = await Prescription.findOne({ where: { medicalRecordId: medicalRecords[i].id } });
      if (!existing) {
        await Prescription.create({
          medicalRecordId: medicalRecords[i].id,
          patientId: medicalRecords[i].patientId,
          medicationName: 'Paracetamol',
          dosage: '500mg',
          quantity: 20,
          unit: 'viên',
          frequency: '3 lần/ngày',
          duration: '3 ngày',
          instructions: 'Uống sau bữa ăn'
        });
        console.log(`✅ Created prescription ${i + 1}`);
      }
    }

    // Create Lab Tests
    for (let i = 0; i < medicalRecords.length; i++) {
      const existing = await LabTest.findOne({ where: { medicalRecordId: medicalRecords[i].id } });
      if (!existing) {
        await LabTest.create({
          medicalRecordId: medicalRecords[i].id,
          patientId: medicalRecords[i].patientId,
          testName: 'Xét nghiệm máu',
          testType: 'Blood Test',
          result: 'Normal',
          normalRange: '4.5-5.5 (triệu/ul)',
          status: 'completed'
        });
        console.log(`✅ Created lab test ${i + 1}`);
      }
    }

    // Create Activities
    await Activity.create({
      type: 'login',
      description: 'Đăng nhập hệ thống',
      user: adminUser.email,
      details: 'Admin đăng nhập vào hệ thống',
      ipAddress: '127.0.0.1'
    });

    await Activity.create({
      type: 'create',
      description: 'Tạo hồ sơ bệnh nhân',
      user: doctorUser.email,
      details: 'Tạo hồ sơ cho bệnh nhân mới',
      ipAddress: '127.0.0.1'
    });

    console.log('✅ Created activities');

    // Create System Settings
    await SystemSettings.create({
      appName: 'Hệ thống Quản lý Bệnh án Điện tử',
      version: '1.0.0',
      maxUploadSize: 5242880,
      sessionTimeout: 3600,
      theme: 'light',
      language: 'vi',
      maintenanceMode: false,
      autoBackupEnabled: true,
      backupFrequency: 'daily',
      emailNotificationsEnabled: true,
      smsNotificationsEnabled: false
    });
    console.log('✅ Created system settings');

    console.log('✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
