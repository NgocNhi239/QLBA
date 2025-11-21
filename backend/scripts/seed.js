const { User, Patient, Doctor, MedicalRecord, Prescription, LabTest, Appointment, sequelize } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');

    // Check if doctor already exists
    let doctorUser = await User.findOne({ where: { email: 'doctor@test.com' } });
    
    if (doctorUser) {
      console.log('Doctor already exists, skipping user creation');
    } else {
      // Create a doctor user
      doctorUser = await User.create({
        email: 'doctor@test.com',
        password: 'password123',
        firstName: 'Nguyễn',
        lastName: 'Văn A',
        role: 'doctor',
        phone: '0123456789',
        address: 'Hà Nội'
      });
      console.log('Doctor user created:', doctorUser.id);
    }

    // Check if doctor profile exists
    let doctor = await Doctor.findOne({ where: { userId: doctorUser.id } });
    
    if (doctor) {
      console.log('Doctor profile already exists');
    } else {
      // Create doctor profile
      doctor = await Doctor.create({
        userId: doctorUser.id,
        specialization: 'General Practice',
        licenseNumber: 'LIC001'
      });
      console.log('Doctor profile created:', doctor.id);
    }

    // Create patient users
    let patientUser1 = await User.findOne({ where: { email: 'patient1@test.com' } });
    if (!patientUser1) {
      patientUser1 = await User.create({
        email: 'patient1@test.com',
        password: 'password123',
        firstName: 'Trần',
        lastName: 'Thị B',
        role: 'patient',
        phone: '0987654321',
        address: 'TP HCM'
      });
    }

    let patientUser2 = await User.findOne({ where: { email: 'patient2@test.com' } });
    if (!patientUser2) {
      patientUser2 = await User.create({
        email: 'patient2@test.com',
        password: 'password123',
        firstName: 'Phạm',
        lastName: 'Văn C',
        role: 'patient',
        phone: '0912345678',
        address: 'Đà Nẵng'
      });
    }

    console.log('Patient users ready');

    // Create patient profiles
    let patient1 = await Patient.findOne({ where: { userId: patientUser1.id } });
    if (!patient1) {
      patient1 = await Patient.create({
        userId: patientUser1.id,
        medicalRecordNumber: 'MRN001',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'female',
        bloodType: 'O+',
        allergies: 'Penicillin',
        address: 'TP HCM'
      });
    }

    let patient2 = await Patient.findOne({ where: { userId: patientUser2.id } });
    if (!patient2) {
      patient2 = await Patient.create({
        userId: patientUser2.id,
        medicalRecordNumber: 'MRN002',
        dateOfBirth: new Date('1985-03-20'),
        gender: 'male',
        bloodType: 'A+',
        allergies: 'None',
        address: 'Đà Nẵng'
      });
    }

    console.log('Patient profiles ready');

    // Create medical records if not exist
    const existingRecords = await MedicalRecord.findAll({
      where: { doctorId: doctorUser.id }
    });

    if (existingRecords.length < 2) {
      const record1 = await MedicalRecord.create({
        patientId: patient1.id,
        doctorId: doctorUser.id,
        visitDate: new Date(),
        primaryDiagnosis: 'Cảm cúp',
        diagnosis: 'Bệnh nhân có triệu chứng sốt, ho, mệt mỏi',
        symptoms: 'Sốt cao, ho khan, đau họng',
        examResult: 'Nhiệt độ 38.5°C, huyết áp bình thường',
        treatment: 'Kê đơn thuốc hạ sốt, kháng sinh',
        notes: 'Theo dõi sau 3 ngày'
      });

      const record2 = await MedicalRecord.create({
        patientId: patient2.id,
        doctorId: doctorUser.id,
        visitDate: new Date(),
        primaryDiagnosis: 'Viêm phổi',
        diagnosis: 'Viêm phổi cộm',
        symptoms: 'Ho kéo dài, khó thở nhẹ',
        examResult: 'X-quang: tấy phổi trái',
        treatment: 'Kê kháng sinh, nghỉ ngơi',
        notes: 'Tái khám sau 1 tuần'
      });

      console.log('Medical records created');

      // Create prescriptions
      await Prescription.create({
        medicalRecordId: record1.id,
        patientId: patient1.id,
        medicationName: 'Paracetamol',
        dosage: '500mg',
        frequency: '3 lần/ngày',
        duration: '5 ngày',
        instructions: 'Uống sau ăn'
      });

      await Prescription.create({
        medicalRecordId: record1.id,
        patientId: patient1.id,
        medicationName: 'Augmentin',
        dosage: '875mg',
        frequency: '2 lần/ngày',
        duration: '7 ngày',
        instructions: 'Uống cùng với nước'
      });

      await Prescription.create({
        medicalRecordId: record2.id,
        patientId: patient2.id,
        medicationName: 'Cephalexin',
        dosage: '500mg',
        frequency: '4 lần/ngày',
        duration: '10 ngày',
        instructions: 'Uống sau ăn'
      });

      console.log('Prescriptions created');

      // Create lab tests
      await LabTest.create({
        medicalRecordId: record1.id,
        patientId: patient1.id,
        testName: 'Xét nghiệm máu toàn bộ',
        description: 'Kiểm tra số lượng và loại tế bào máu',
        result: 'WBC: 8.5, RBC: 4.5, HGB: 13.2',
        status: 'completed'
      });

      await LabTest.create({
        medicalRecordId: record2.id,
        patientId: patient2.id,
        testName: 'X-quang ngực',
        description: 'Chụp X-quang để kiểm tra phổi',
        result: 'Tấy phổi trái, viêm phổi cộm',
        status: 'completed'
      });

      console.log('Lab tests created');
    }

    // Create appointments if not exist
    const existingAppointments = await Appointment.findAll({
      where: { doctorId: doctor.id }
    });

    if (existingAppointments.length < 2) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await Appointment.create({
        doctorId: doctor.id,
        patientId: patient1.id,
        appointmentDate: tomorrow,
        status: 'confirmed',
        reason: 'Tái khám theo dõi cảm cúp'
      });

      await Appointment.create({
        doctorId: doctor.id,
        patientId: patient2.id,
        appointmentDate: new Date(tomorrow.getTime() + 3600000),
        status: 'pending',
        reason: 'Khám kiểm tra viêm phổi'
      });

      console.log('Appointments created');
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
