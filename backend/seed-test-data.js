const { User, Patient, Doctor, MedicalRecord, Prescription, LabTest, Appointment, Activity, SystemLog, SystemSettings, UserPreference } = require('./models');

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Create admin user (model will hash password)
    const adminUser = await User.create({
      email: 'admin@qlba.com',
      password: 'Admin@123456',
      firstName: 'Quản Trị',
      lastName: 'Viên',
      role: 'admin',
      phone: '0901234567',
      address: 'Hà Nội, Việt Nam'
    });
    console.log('✓ Admin user created');

    // Create doctor users (model will hash password)
    const doctor1 = await User.create({
      email: 'doctor1@qlba.com',
      password: 'doctor123',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      role: 'doctor',
      phone: '0912345678',
      address: 'Quận 1, TP HCM'
    });

    const doctor2 = await User.create({
      email: 'doctor2@qlba.com',
      password: 'doctor123',
      firstName: 'Trần',
      lastName: 'Thị B',
      role: 'doctor',
      phone: '0923456789',
      address: 'Quận 3, TP HCM'
    });

    const doctor3 = await User.create({
      email: 'doctor3@qlba.com',
      password: 'doctor123',
      firstName: 'Phạm',
      lastName: 'Văn C',
      role: 'doctor',
      phone: '0934567890',
      address: 'Quận 5, TP HCM'
    });

    const doctor4 = await User.create({
      email: 'doctor4@qlba.com',
      password: 'doctor123',
      firstName: 'Lê',
      lastName: 'Thị D',
      role: 'doctor',
      phone: '0945678901',
      address: 'Quận 7, TP HCM'
    });

    const doctor5 = await User.create({
      email: 'doctor5@qlba.com',
      password: 'doctor123',
      firstName: 'Hoàng',
      lastName: 'Văn E',
      role: 'doctor',
      phone: '0956789012',
      address: 'Quận 10, TP HCM'
    });
    console.log('✓ Doctor users created (5)');

    const doctorProfile1 = await Doctor.create({
      userId: doctor1.id,
      specialization: 'Tim Mạch',
      licenseNumber: 'LIC-2024-001',
      yearsOfExperience: 10,
      availableSlots: 5,
      bio: 'Bác sĩ chuyên khoa Tim Mạch với 10 năm kinh nghiệm'
    });

    const doctorProfile2 = await Doctor.create({
      userId: doctor2.id,
      specialization: 'Nhi Khoa',
      licenseNumber: 'LIC-2024-002',
      yearsOfExperience: 8,
      availableSlots: 5,
      bio: 'Bác sĩ chuyên khoa Nhi Khoa với 8 năm kinh nghiệm'
    });

    const doctorProfile3 = await Doctor.create({
      userId: doctor3.id,
      specialization: 'Da Liễu',
      licenseNumber: 'LIC-2024-003',
      yearsOfExperience: 12,
      availableSlots: 5,
      bio: 'Bác sĩ chuyên khoa Da Liễu với 12 năm kinh nghiệm'
    });

    const doctorProfile4 = await Doctor.create({
      userId: doctor4.id,
      specialization: 'Tai Mũi Họng',
      licenseNumber: 'LIC-2024-004',
      yearsOfExperience: 6,
      availableSlots: 5,
      bio: 'Bác sĩ chuyên khoa Tai Mũi Họng với 6 năm kinh nghiệm'
    });

    const doctorProfile5 = await Doctor.create({
      userId: doctor5.id,
      specialization: 'Hô Hấp',
      licenseNumber: 'LIC-2024-005',
      yearsOfExperience: 9,
      availableSlots: 5,
      bio: 'Bác sĩ chuyên khoa Hô Hấp với 9 năm kinh nghiệm'
    });
    console.log('✓ Doctor profiles created (5)');

    // Create patient users
    const patient1 = await User.create({
      email: 'patient1@qlba.com',
      password: 'patient123',
      firstName: 'Phạm',
      lastName: 'Văn C',
      role: 'patient',
      phone: '0934567890',
      address: 'Quận 7, TP HCM'
    });

    const patient2 = await User.create({
      email: 'patient2@qlba.com',
      password: 'patient123',
      firstName: 'Lê',
      lastName: 'Thị D',
      role: 'patient',
      phone: '0945678901',
      address: 'Quận 10, TP HCM'
    });

    const patient3 = await User.create({
      email: 'patient3@qlba.com',
      password: 'patient123',
      firstName: 'Hoàng',
      lastName: 'Văn E',
      role: 'patient',
      phone: '0956789012',
      address: 'Quận Bình Thạnh, TP HCM'
    });

    const patient4 = await User.create({
      email: 'patient4@qlba.com',
      password: 'patient123',
      firstName: 'Trương',
      lastName: 'Văn F',
      role: 'patient',
      phone: '0967890123',
      address: 'Quận Gò Vấp, TP HCM'
    });

    const patient5 = await User.create({
      email: 'patient5@qlba.com',
      password: 'patient123',
      firstName: 'Vũ',
      lastName: 'Thị G',
      role: 'patient',
      phone: '0978901234',
      address: 'Quận 12, TP HCM'
    });

    const patient6 = await User.create({
      email: 'patient6@qlba.com',
      password: 'patient123',
      firstName: 'Dương',
      lastName: 'Văn H',
      role: 'patient',
      phone: '0989012345',
      address: 'Huyện Bình Chánh, TP HCM'
    });
    console.log('✓ Patient users created (6)');

    // Create patient profiles
    const patientProfile1 = await Patient.create({
      userId: patient1.id,
      medicalRecordNumber: 'MRN-2024-001',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      bloodType: 'O+',
      allergies: 'Không',
      medicalHistory: 'Cao huyết áp',
      insurance: 'BHYT-001',
      emergencyContact: 'Phạm Văn F',
      emergencyPhone: '0967890123'
    });

    const patientProfile2 = await Patient.create({
      userId: patient2.id,
      medicalRecordNumber: 'MRN-2024-002',
      dateOfBirth: new Date('1995-03-20'),
      gender: 'female',
      bloodType: 'A+',
      allergies: 'Penicillin',
      medicalHistory: 'Đái tháo đường type 2',
      insurance: 'BHYT-002',
      emergencyContact: 'Lê Văn G',
      emergencyPhone: '0978901234'
    });

    const patientProfile3 = await Patient.create({
      userId: patient3.id,
      medicalRecordNumber: 'MRN-2024-003',
      dateOfBirth: new Date('2010-01-10'),
      gender: 'male',
      bloodType: 'B+',
      allergies: 'Không',
      medicalHistory: 'Không',
      insurance: 'BHYT-003',
      emergencyContact: 'Hoàng Thị H',
      emergencyPhone: '0989012345'
    });

    const patientProfile4 = await Patient.create({
      userId: patient4.id,
      medicalRecordNumber: 'MRN-2024-004',
      dateOfBirth: new Date('1988-07-22'),
      gender: 'male',
      bloodType: 'AB+',
      allergies: 'Aspirin',
      medicalHistory: 'Hen suyễn',
      insurance: 'BHYT-004',
      emergencyContact: 'Trương Thị I',
      emergencyPhone: '0990123456'
    });

    const patientProfile5 = await Patient.create({
      userId: patient5.id,
      medicalRecordNumber: 'MRN-2024-005',
      dateOfBirth: new Date('1992-11-30'),
      gender: 'female',
      bloodType: 'O-',
      allergies: 'Không',
      medicalHistory: 'Viêm đại tràng',
      insurance: 'BHYT-005',
      emergencyContact: 'Vũ Văn J',
      emergencyPhone: '0901234567'
    });

    const patientProfile6 = await Patient.create({
      userId: patient6.id,
      medicalRecordNumber: 'MRN-2024-006',
      dateOfBirth: new Date('1985-09-14'),
      gender: 'male',
      bloodType: 'B-',
      allergies: 'Không',
      medicalHistory: 'Viêm khớp',
      insurance: 'BHYT-006',
      emergencyContact: 'Dương Thị K',
      emergencyPhone: '0912345678'
    });
    console.log('✓ Patient profiles created (6)');

    // Create medical records
    const medicalRecord1 = await MedicalRecord.create({
      patientId: patientProfile1.id,
      doctorId: doctor1.id,
      visitDate: new Date('2024-11-20'),
      department: 'Tim Mạch',
      reason: 'Kiểm tra sức khỏe định kỳ',
      symptoms: 'Đau ngực nhẹ, khó thở',
      clinicalExamination: 'Huyết áp: 140/90, nhịp tim: 85',
      diagnosis: 'Cao huyết áp',
      primaryDiagnosis: 'Cao huyết áp Giai đoạn 2',
      treatment: 'Dùng thuốc hạ huyết áp, chế độ ăn uống, tập thể dục',
      examResult: 'Cần theo dõi thêm',
      notes: 'Bệnh nhân cần kiểm tra định kỳ hàng 3 tháng',
      status: 'completed'
    });

    const medicalRecord2 = await MedicalRecord.create({
      patientId: patientProfile2.id,
      doctorId: doctor2.id,
      visitDate: new Date('2024-11-19'),
      department: 'Nhi Khoa',
      reason: 'Khám sức khỏe định kỳ',
      symptoms: 'Không',
      clinicalExamination: 'Bình thường',
      diagnosis: 'Khỏe mạnh',
      primaryDiagnosis: 'Bình thường',
      treatment: 'Không cần điều trị',
      examResult: 'Bình thường',
      notes: 'Tiếp tục theo dõi quản lý đái tháo đường',
      status: 'completed'
    });

    const medicalRecord3 = await MedicalRecord.create({
      patientId: patientProfile3.id,
      doctorId: doctor2.id,
      visitDate: new Date('2024-11-18'),
      department: 'Nhi Khoa',
      reason: 'Khám tập thể',
      symptoms: 'Không',
      clinicalExamination: 'Bình thường',
      diagnosis: 'Khỏe mạnh',
      primaryDiagnosis: 'Bình thường',
      treatment: 'Không cần điều trị',
      examResult: 'Bình thường',
      notes: 'Trẻ phát triển bình thường',
      status: 'completed'
    });

    const medicalRecord4 = await MedicalRecord.create({
      patientId: patientProfile4.id,
      doctorId: doctor3.id,
      visitDate: new Date('2024-11-17'),
      department: 'Da Liễu',
      reason: 'Khám da liễu',
      symptoms: 'Ngứa, đỏ da',
      clinicalExamination: 'Viêm da, phát ban',
      diagnosis: 'Viêm da dị ứng',
      primaryDiagnosis: 'Viêm da dị ứng cấp tính',
      treatment: 'Dùng kem trị, tránh tác nhân gây dị ứng',
      examResult: 'Cải thiện sau 1 tuần',
      notes: 'Tư vấn chế độ ăn và vệ sinh',
      status: 'completed'
    });

    const medicalRecord5 = await MedicalRecord.create({
      patientId: patientProfile5.id,
      doctorId: doctor4.id,
      visitDate: new Date('2024-11-16'),
      department: 'Tai Mũi Họng',
      reason: 'Khám viêm họng',
      symptoms: 'Đau họng, sốt',
      clinicalExamination: 'Họng đỏ, sưng',
      diagnosis: 'Viêm họng cấp tính',
      primaryDiagnosis: 'Viêm họng do virus',
      treatment: 'Uống thuốc hạ sốt, súc miệng',
      examResult: 'Bình thường',
      notes: 'Hết sốt sau 3 ngày',
      status: 'completed'
    });

    const medicalRecord6 = await MedicalRecord.create({
      patientId: patientProfile6.id,
      doctorId: doctor5.id,
      visitDate: new Date('2024-11-15'),
      department: 'Hô Hấp',
      reason: 'Khám ho',
      symptoms: 'Ho dai dẳng, khó thở',
      clinicalExamination: 'Âm phổi bất thường',
      diagnosis: 'Viêm phế quản cấp tính',
      primaryDiagnosis: 'Viêm phế quản',
      treatment: 'Dùng thuốc ho, kháng sinh',
      examResult: 'Phục hồi sau 1 tuần',
      notes: 'Uống đủ nước, nghỉ ngơi',
      status: 'completed'
    });
    console.log('✓ Medical records created (6)');

    // Create prescriptions
    const prescription1 = await Prescription.create({
      medicalRecordId: medicalRecord1.id,
      patientId: patientProfile1.id,
      medicationName: 'Lisinopril',
      dosage: '10mg',
      quantity: 30,
      unit: 'viên',
      frequency: '1 lần/ngày',
      duration: '3 tháng',
      route: 'Uống',
      instructions: 'Uống vào buổi sáng, trước khi ăn',
      expiryDate: new Date('2025-02-20'),
      status: 'active'
    });

    const prescription2 = await Prescription.create({
      medicalRecordId: medicalRecord1.id,
      patientId: patientProfile1.id,
      medicationName: 'Atorvastatin',
      dosage: '20mg',
      quantity: 30,
      unit: 'viên',
      frequency: '1 lần/ngày',
      duration: '3 tháng',
      route: 'Uống',
      instructions: 'Uống vào buổi tối',
      expiryDate: new Date('2025-02-20'),
      status: 'active'
    });

    const prescription3 = await Prescription.create({
      medicalRecordId: medicalRecord2.id,
      patientId: patientProfile2.id,
      medicationName: 'Metformin',
      dosage: '500mg',
      quantity: 60,
      unit: 'viên',
      frequency: '2 lần/ngày',
      duration: '3 tháng',
      route: 'Uống',
      instructions: 'Uống cùng bữa ăn',
      expiryDate: new Date('2025-02-19'),
      status: 'active'
    });

    const prescription4 = await Prescription.create({
      medicalRecordId: medicalRecord4.id,
      patientId: patientProfile4.id,
      medicationName: 'Hydrocortisone',
      dosage: '1%',
      quantity: 1,
      unit: 'hộp',
      frequency: '2 lần/ngày',
      duration: '7 ngày',
      route: 'Bôi ngoài',
      instructions: 'Bôi trực tiếp lên vùng da bị viêm',
      expiryDate: new Date('2024-12-15'),
      status: 'active'
    });

    const prescription5 = await Prescription.create({
      medicalRecordId: medicalRecord5.id,
      patientId: patientProfile5.id,
      medicationName: 'Paracetamol',
      dosage: '500mg',
      quantity: 20,
      unit: 'viên',
      frequency: '3 lần/ngày',
      duration: '3 ngày',
      route: 'Uống',
      instructions: 'Uống khi có triệu chứng',
      expiryDate: new Date('2025-02-15'),
      status: 'active'
    });

    const prescription6 = await Prescription.create({
      medicalRecordId: medicalRecord6.id,
      patientId: patientProfile6.id,
      medicationName: 'Amoxicillin',
      dosage: '500mg',
      quantity: 21,
      unit: 'viên',
      frequency: '3 lần/ngày',
      duration: '7 ngày',
      route: 'Uống',
      instructions: 'Uống sau bữa ăn',
      expiryDate: new Date('2025-02-15'),
      status: 'active'
    });
    console.log('✓ Prescriptions created (6)');

    // Create lab tests
    const labTest1 = await LabTest.create({
      medicalRecordId: medicalRecord1.id,
      patientId: patientProfile1.id,
      testName: 'Xét nghiệm máu toàn phần',
      testCode: 'CBC-001',
      orderedDate: new Date('2024-11-20'),
      resultDate: new Date('2024-11-21'),
      resultValue: 'Bình thường',
      normalRange: '4.5-11.0 (WBC)',
      unit: '10^9/L',
      status: 'completed',
      notes: 'Kết quả bình thường'
    });

    const labTest2 = await LabTest.create({
      medicalRecordId: medicalRecord1.id,
      patientId: patientProfile1.id,
      testName: 'Xét nghiệm glucose máu',
      testCode: 'GLU-001',
      orderedDate: new Date('2024-11-20'),
      resultDate: new Date('2024-11-21'),
      resultValue: '110',
      normalRange: '70-100',
      unit: 'mg/dL',
      status: 'completed',
      notes: 'Cao hơn bình thường, cần kiểm tra tiếp'
    });

    const labTest3 = await LabTest.create({
      medicalRecordId: medicalRecord2.id,
      patientId: patientProfile2.id,
      testName: 'Xét nghiệm HbA1c',
      testCode: 'HBA1C-001',
      orderedDate: new Date('2024-11-19'),
      resultDate: new Date('2024-11-20'),
      resultValue: '7.2',
      normalRange: '<7.0',
      unit: '%',
      status: 'completed',
      notes: 'Điều trị đái tháo đường cần cải thiện'
    });

    const labTest4 = await LabTest.create({
      medicalRecordId: medicalRecord3.id,
      patientId: patientProfile3.id,
      testName: 'Xét nghiệm urine',
      testCode: 'URN-001',
      orderedDate: new Date('2024-11-18'),
      resultDate: new Date('2024-11-19'),
      resultValue: 'Bình thường',
      normalRange: 'Bình thường',
      unit: 'N/A',
      status: 'completed',
      notes: 'Không phát hiện bất thường'
    });

    const labTest5 = await LabTest.create({
      medicalRecordId: medicalRecord4.id,
      patientId: patientProfile4.id,
      testName: 'Xét nghiệm dị ứng IgE',
      testCode: 'IGE-001',
      orderedDate: new Date('2024-11-17'),
      resultDate: new Date('2024-11-18'),
      resultValue: 'Cao',
      normalRange: '<150',
      unit: 'IU/mL',
      status: 'completed',
      notes: 'Có dấu hiệu dị ứng'
    });

    const labTest6 = await LabTest.create({
      medicalRecordId: medicalRecord5.id,
      patientId: patientProfile5.id,
      testName: 'Xét nghiệm C-Reactive Protein',
      testCode: 'CRP-001',
      orderedDate: new Date('2024-11-16'),
      resultDate: new Date('2024-11-17'),
      resultValue: '5.2',
      normalRange: '<3.0',
      unit: 'mg/L',
      status: 'completed',
      notes: 'Có viêm nhiễm'
    });
    console.log('✓ Lab tests created (6)');

    // Create appointments
    const appointment1 = await Appointment.create({
      patientId: patientProfile1.id,
      doctorId: doctorProfile1.id,
      appointmentDate: new Date('2024-11-25 10:00:00'),
      status: 'confirmed',
      reason: 'Tái khám kiểm tra huyết áp',
      notes: 'Chuẩn bị máu sơ cấp và máu glucose'
    });

    const appointment2 = await Appointment.create({
      patientId: patientProfile2.id,
      doctorId: doctorProfile2.id,
      appointmentDate: new Date('2024-11-26 14:00:00'),
      status: 'pending',
      reason: 'Kiểm tra đái tháo đường',
      notes: 'Mang theo máu glucose và HbA1c'
    });

    const appointment3 = await Appointment.create({
      patientId: patientProfile3.id,
      doctorId: doctorProfile2.id,
      appointmentDate: new Date('2024-11-27 09:30:00'),
      status: 'pending',
      reason: 'Khám sức khỏe định kỳ',
      notes: 'Khám tập thể lớp'
    });

    const appointment4 = await Appointment.create({
      patientId: patientProfile4.id,
      doctorId: doctorProfile3.id,
      appointmentDate: new Date('2024-11-28 15:00:00'),
      status: 'confirmed',
      reason: 'Tái khám da liễu',
      notes: 'Theo dõi tiến trình chữa trị'
    });

    const appointment5 = await Appointment.create({
      patientId: patientProfile5.id,
      doctorId: doctorProfile4.id,
      appointmentDate: new Date('2024-11-29 11:00:00'),
      status: 'confirmed',
      reason: 'Tái khám họng',
      notes: 'Kiểm tra sức khỏe sau điều trị'
    });

    const appointment6 = await Appointment.create({
      patientId: patientProfile6.id,
      doctorId: doctorProfile5.id,
      appointmentDate: new Date('2024-11-30 13:30:00'),
      status: 'pending',
      reason: 'Khám hô hấp',
      notes: 'Chỉ định chụp X-quang phổi'
    });
    console.log('✓ Appointments created (6)');

    // Create system settings
    const systemSettings = await SystemSettings.create({
      appName: 'QLBA - Electronic Health Record System',
      appVersion: '1.0.0',
      maintenanceMode: false,
      maxUploadSize: 10,
      sessionTimeout: 30,
      emailNotifications: true,
      smsNotifications: true,
      backupEnabled: true,
      backupFrequency: 'daily',
      theme: 'light',
      language: 'vi'
    });
    console.log('✓ System settings created');

    // Create user preferences for all users
    await UserPreference.create({
      userId: adminUser.id,
      theme: 'light',
      language: 'vi',
      notifications: true,
      emailNotifications: true,
      smsNotifications: true,
      autoBackup: true,
      backupFrequency: 'daily'
    });

    await UserPreference.create({
      userId: doctor1.id,
      theme: 'light',
      language: 'vi',
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      autoBackup: true,
      backupFrequency: 'daily'
    });

    await UserPreference.create({
      userId: doctor2.id,
      theme: 'light',
      language: 'vi',
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      autoBackup: true,
      backupFrequency: 'daily'
    });

    await UserPreference.create({
      userId: patient1.id,
      theme: 'light',
      language: 'vi',
      notifications: true,
      emailNotifications: true,
      smsNotifications: true,
      autoBackup: false,
      backupFrequency: 'weekly'
    });

    await UserPreference.create({
      userId: patient2.id,
      theme: 'light',
      language: 'vi',
      notifications: true,
      emailNotifications: true,
      smsNotifications: true,
      autoBackup: false,
      backupFrequency: 'weekly'
    });

    await UserPreference.create({
      userId: patient3.id,
      theme: 'light',
      language: 'vi',
      notifications: true,
      emailNotifications: true,
      smsNotifications: true,
      autoBackup: false,
      backupFrequency: 'weekly'
    });
    console.log('✓ User preferences created');

    // Create activities
    const activities = [
      { type: 'login', description: 'Admin đăng nhập vào hệ thống', user: adminUser.email, details: 'Đăng nhập thành công' },
      { type: 'login', description: 'Doctor 1 đăng nhập vào hệ thống', user: doctor1.email, details: 'Đăng nhập thành công' },
      { type: 'view', description: 'Doctor 1 xem dashboard', user: doctor1.email, details: 'Xem tổng quan bảng điều khiển' },
      { type: 'create', description: 'Doctor 1 tạo hồ sơ bệnh án', user: doctor1.email, details: 'Tạo hồ sơ bệnh án mới cho bệnh nhân' },
      { type: 'update', description: 'Doctor 1 cập nhật hồ sơ bệnh án', user: doctor1.email, details: 'Cập nhật chẩn đoán và điều trị' },
      { type: 'create', description: 'Doctor 1 tạo đơn thuốc', user: doctor1.email, details: 'Tạo đơn thuốc cho bệnh nhân' },
      { type: 'login', description: 'Patient 1 đăng nhập vào hệ thống', user: patient1.email, details: 'Đăng nhập thành công' },
      { type: 'view', description: 'Patient 1 xem hồ sơ bệnh án', user: patient1.email, details: 'Xem hồ sơ bệnh án của mình' },
      { type: 'create', description: 'Doctor 2 tạo hồ sơ bệnh án', user: doctor2.email, details: 'Tạo hồ sơ bệnh án cho bệnh nhân khác' },
      { type: 'update', description: 'Admin cập nhật cài đặt hệ thống', user: adminUser.email, details: 'Cập nhật cài đặt hệ thống' }
    ];

    for (const activity of activities) {
      await Activity.create({
        ...activity,
        ipAddress: '127.0.0.1'
      });
    }
    console.log('✓ Activities created (10)');

    // Create system logs
    const systemLogs = [
      { type: 'INFO', user: 'system', action: 'Database initialized', details: 'Cơ sở dữ liệu được khởi tạo' },
      { type: 'INFO', user: 'system', action: 'Server started', details: 'Server đã khởi động' },
      { type: 'INFO', user: adminUser.email, action: 'User login', details: 'Admin đăng nhập' },
      { type: 'INFO', user: doctor1.email, action: 'User login', details: 'Doctor 1 đăng nhập' },
      { type: 'INFO', user: doctor1.email, action: 'Create medical record', details: 'Tạo hồ sơ bệnh án' },
      { type: 'INFO', user: doctor1.email, action: 'Create prescription', details: 'Tạo đơn thuốc' },
      { type: 'WARNING', user: 'system', action: 'High database load', details: 'Tải cơ sở dữ liệu cao' },
      { type: 'INFO', user: patient1.email, action: 'User login', details: 'Bệnh nhân đăng nhập' },
      { type: 'INFO', user: 'system', action: 'Backup completed', details: 'Sao lưu hoàn thành' },
      { type: 'INFO', user: adminUser.email, action: 'System settings updated', details: 'Cài đặt hệ thống được cập nhật' }
    ];

    for (const log of systemLogs) {
      await SystemLog.create({
        ...log,
        ipAddress: '127.0.0.1'
      });
    }
    console.log('✓ System logs created (10)');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@qlba.com / Admin@123456');
    console.log('Doctor 1-5: doctor1-5@qlba.com / doctor123');
    console.log('Patient 1-6: patient1-6@qlba.com / patient123');
    console.log('\n📊 Seeded Data Summary:');
    console.log('- Users: 13 (1 admin, 5 doctors, 6 patients)');
    console.log('- Doctors: 5 with different specializations');
    console.log('- Patients: 6 with medical profiles');
    console.log('- Medical Records: 6');
    console.log('- Prescriptions: 6');
    console.log('- Lab Tests: 6');
    console.log('- Appointments: 6');
    console.log('- Activities: 10');
    console.log('- System Logs: 10');
    console.log('- User Preferences: 8');
    console.log('- System Settings: 1');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
