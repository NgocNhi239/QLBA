const { User, Patient, Doctor, MedicalRecord, Prescription, LabTest, Appointment, MedicalHistory, VitalSigns, PatientDocument, Activity, SystemLog, SystemSettings, UserPreference } = require('./models');

async function seedDatabase() {
  try {
    console.log('Starting complete database seed...');

    // ============= CREATE USERS =============
    // Create admin user
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

    // Create 5 doctor users
    const doctor1 = await User.create({
      email: 'bacsi01@email.com',
      password: '123456',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      role: 'doctor',
      phone: '0912345678',
      address: 'Quận 1, TP HCM'
    });

    const doctor2 = await User.create({
      email: 'bacsi02@email.com',
      password: '123456',
      firstName: 'Trần',
      lastName: 'Thị B',
      role: 'doctor',
      phone: '0923456789',
      address: 'Quận 3, TP HCM'
    });

    const doctor3 = await User.create({
      email: 'bacsi03@email.com',
      password: '123456',
      firstName: 'Phạm',
      lastName: 'Văn C',
      role: 'doctor',
      phone: '0934567890',
      address: 'Quận 5, TP HCM'
    });

    const doctor4 = await User.create({
      email: 'doctor4@qlba.com',
      password: '123456',
      firstName: 'Lê',
      lastName: 'Thị D',
      role: 'doctor',
      phone: '0945678901',
      address: 'Quận 7, TP HCM'
    });

    const doctor5 = await User.create({
      email: 'doctor5@qlba.com',
      password: '123456',
      firstName: 'Hoàng',
      lastName: 'Văn E',
      role: 'doctor',
      phone: '0956789012',
      address: 'Quận 10, TP HCM'
    });
    console.log('✓ Doctor users created (5)');

    // Create doctor profiles
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

    // Create 11 patient users
    const patientUsers = [];
    const patientProfiles = [];
    
    for (let i = 1; i <= 11; i++) {
      const patientUser = await User.create({
        email: `bnh0${i}@email.com`,
        password: '123456',
        firstName: `Bệnh nhân`,
        lastName: `${i}`,
        role: 'patient',
        phone: `0${9}${Math.random().toString().slice(2, 10)}`,
        address: `Địa chỉ bệnh nhân ${i}, TP HCM`
      });

      const patientProfile = await Patient.create({
        userId: patientUser.id,
        medicalRecordNumber: `MRN-2024-${String(i).padStart(3, '0')}`,
        dateOfBirth: new Date(`1980-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`),
        gender: i % 2 === 0 ? 'female' : 'male',
        bloodType: ['O+', 'A+', 'B+', 'AB+', 'O-'][i % 5],
        allergies: i % 3 === 0 ? 'Dị ứng Penicillin' : 'Không có',
        medicalHistory: i % 2 === 0 ? 'Cao huyết áp' : 'Không',
        insurance: `BHYT-${String(i).padStart(3, '0')}`,
        emergencyContact: `Người thân ${i}`,
        emergencyPhone: `091${Math.random().toString().slice(2, 9)}`
      });

      patientUsers.push(patientUser);
      patientProfiles.push(patientProfile);
    }
    console.log('✓ Patient users and profiles created (11)');

    // ============= CREATE MEDICAL HISTORY FOR EACH PATIENT =============
    for (const patientProfile of patientProfiles) {
      await MedicalHistory.create({
        patientId: patientProfile.id,
        pastDiseases: 'Cảm lạnh, viêm họng, đau đầu',
        allergies: patientProfile.allergies,
        allergyDetails: patientProfile.allergies === 'Không có' ? '' : 'Dị ứng kháng sinh penicillin',
        surgeries: 'Phẫu thuật ruột thừa năm 2015',
        familyHistory: 'Bố mẹ có bệnh tiểu đường, Ông bà có cao huyết áp',
        currentMedications: 'Không dùng thuốc định kỳ',
        smoker: false,
        alcohol: false,
        occupation: 'Nhân viên văn phòng',
        vaccinations: JSON.stringify({ polio: '2024-01-15', influenza: '2024-10-01' }),
        notes: 'Sức khỏe tương đối ổn định'
      });
    }
    console.log('✓ Medical histories created for all patients (11)');

    // ============= CREATE MEDICAL RECORDS =============
    const medicalRecords = [];
    const doctors = [doctorProfile1, doctorProfile2, doctorProfile3, doctorProfile4, doctorProfile5];
    
    for (let i = 0; i < patientProfiles.length; i++) {
      const patientProfile = patientProfiles[i];
      const doctor = doctors[i % doctors.length];
      
      // Create 2-3 medical records per patient
      const recordCount = (i % 2) + 2;
      
      for (let r = 0; r < recordCount; r++) {
        const visitDate = new Date();
        visitDate.setDate(visitDate.getDate() - (r * 7));

        const diagnoses = [
          { primary: 'Cảm lạnh', detail: 'Cảm lạnh thông thường do virus', symptoms: 'Sốt, ho, hắt hơi', treatment: 'Uống thuốc hạ sốt, nghỉ ngơi' },
          { primary: 'Viêm họng', detail: 'Viêm họng cấp do vi khuẩn', symptoms: 'Đau họng, sốt', treatment: 'Dùng kháng sinh, súc miệng nước muối' },
          { primary: 'Đau đầu', detail: 'Đau đầu kiểu căng', symptoms: 'Đau hai bên thái dương', treatment: 'Uống thuốc giảm đau, thư giãn' },
          { primary: 'Tiểu đường', detail: 'Tiểu đường type 2', symptoms: 'Khát nước, tiểu nhiều', treatment: 'Dùng Metformin, kiểm soát chế độ ăn' },
          { primary: 'Cao huyết áp', detail: 'Cao huyết áp giai đoạn 1', symptoms: 'Đau đầu, chóng mặt', treatment: 'Dùng Lisinopril, giảm muối' },
          { primary: 'Viêm dạ dày', detail: 'Viêm dạ dày mãn tính', symptoms: 'Đau bụng, buồn nôn', treatment: 'Dùng Omeprazole, ăn đủ bữa' },
          { primary: 'Khám sức khỏe', detail: 'Khám sức khỏe định kỳ', symptoms: 'Không có triệu chứng', treatment: 'Tư vấn lối sống lành mạnh' }
        ];

        const diagnosis = diagnoses[(i + r) % diagnoses.length];

        const medicalRecord = await MedicalRecord.create({
          patientId: patientProfile.id,
          doctorId: doctor.userId,
          visitDate: visitDate,
          visitType: r === 0 ? 'initial' : 'followup',
          department: doctor.specialization,
          reason: diagnosis.primary,
          symptoms: diagnosis.symptoms,
          clinicalExamination: 'Bình thường',
          physicalExamDetails: JSON.stringify({
            headNeck: 'Bình thường',
            lungs: 'Âm phổi rõ',
            heart: 'Tim đều, không có tâm âm lạ',
            abdomen: 'Mềm, không đau',
            extremities: 'Bình thường'
          }),
          diagnosis: diagnosis.detail,
          primaryDiagnosis: diagnosis.primary,
          secondaryDiagnosis: '',
          treatment: diagnosis.treatment,
          examResult: 'Bình thường',
          followUpRequired: r === 0 ? true : false,
          followUpDate: r === 0 ? new Date(visitDate.getTime() + 30 * 24 * 60 * 60 * 1000) : null,
          followUpNotes: r === 0 ? 'Tái khám sau 1 tháng' : '',
          notes: `Bệnh nhân được khám lần ${r + 1}`,
          status: 'completed'
        });

        medicalRecords.push(medicalRecord);

        // Create vital signs for each medical record
        await VitalSigns.create({
          medicalRecordId: medicalRecord.id,
          systolicBP: 100 + Math.random() * 40,
          diastolicBP: 60 + Math.random() * 30,
          heartRate: 60 + Math.random() * 40,
          temperature: 36.5 + Math.random() * 1,
          respiratoryRate: 14 + Math.random() * 10,
          oxygenSaturation: 95 + Math.random() * 5,
          height: 160 + Math.random() * 20,
          weight: 55 + Math.random() * 25,
          bmi: 20 + Math.random() * 10,
          headExam: 'Bình thường, không có sưng hạch',
          lungExam: 'Âm phổi rõ, không có rale',
          heartExam: 'Tim đều, S1 S2 bình thường',
          abdomenExam: 'Mềm, không đau, không sưng phồng',
          extremitiesExam: 'Sưng tấy, cử động tốt, mạch máu bình thường',
          neurologicalExam: 'Tỉnh táo, phản xạ bình thường',
          generalAppearance: 'Tỉnh táo, hợp tác',
          notes: 'Bệnh nhân có dấu hiệu bình thường'
        });
      }
    }
    console.log(`✓ Medical records created (${medicalRecords.length})`);
    console.log(`✓ Vital signs created (${medicalRecords.length})`);

    // ============= CREATE PRESCRIPTIONS =============
    let prescriptionCount = 0;
    const medications = [
      { name: 'Paracetamol', dosage: '500mg', frequency: '3 lần/ngày', duration: '5 ngày', unit: 'viên' },
      { name: 'Ibuprofen', dosage: '400mg', frequency: '2 lần/ngày', duration: '7 ngày', unit: 'viên' },
      { name: 'Amoxicillin', dosage: '500mg', frequency: '3 lần/ngày', duration: '7 ngày', unit: 'viên' },
      { name: 'Omeprazole', dosage: '20mg', frequency: '1 lần/ngày', duration: '14 ngày', unit: 'viên' },
      { name: 'Metformin', dosage: '500mg', frequency: '2 lần/ngày', duration: '30 ngày', unit: 'viên' },
      { name: 'Lisinopril', dosage: '10mg', frequency: '1 lần/ngày', duration: '30 ngày', unit: 'viên' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: '1 lần/ngày', duration: '30 ngày', unit: 'viên' },
      { name: 'Hydrocortisone', dosage: '1%', frequency: '2 lần/ngày', duration: '7 ngày', unit: 'hộp' }
    ];

    for (const medicalRecord of medicalRecords) {
      // 1-2 prescriptions per medical record
      const presCount = (Math.floor(Math.random() * 2) + 1);
      for (let p = 0; p < presCount; p++) {
        const med = medications[(prescriptionCount + p) % medications.length];
        
        await Prescription.create({
          medicalRecordId: medicalRecord.id,
          patientId: medicalRecord.patientId,
          medicationName: med.name,
          dosage: med.dosage,
          quantity: med.frequency === '1 lần/ngày' ? 30 : med.frequency === '2 lần/ngày' ? 60 : 90,
          unit: med.unit,
          frequency: med.frequency,
          duration: med.duration,
          route: med.unit === 'hộp' ? 'Bôi ngoài' : 'Uống',
          instructions: med.unit === 'hộp' ? `Bôi trực tiếp ${med.frequency}` : `Uống ${med.frequency}`,
          expiryDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
          status: 'active'
        });
        prescriptionCount++;
      }
    }
    console.log(`✓ Prescriptions created (${prescriptionCount})`);

    // ============= CREATE LAB TESTS =============
    let labTestCount = 0;
    const labTests = [
      { name: 'Xét nghiệm máu toàn phần', category: 'hematology', code: 'CBC-001', normalRange: '4.5-11.0', unit: '10^9/L' },
      { name: 'Xét nghiệm glucose máu', category: 'biochemistry', code: 'GLU-001', normalRange: '70-100', unit: 'mg/dL' },
      { name: 'Xét nghiệm cholesterol', category: 'biochemistry', code: 'CHOL-001', normalRange: '<200', unit: 'mg/dL' },
      { name: 'Xét nghiệm triglyceride', category: 'biochemistry', code: 'TRIG-001', normalRange: '<150', unit: 'mg/dL' },
      { name: 'Siêu âm tim', category: 'imaging', code: 'ECHO-001', normalRange: 'Bình thường', unit: '' },
      { name: 'X-quang ngực', category: 'imaging', code: 'XR-CHEST-001', normalRange: 'Bình thường', unit: '' },
      { name: 'CT scan', category: 'imaging', code: 'CT-001', normalRange: 'Bình thường', unit: '' },
      { name: 'Xét nghiệm đông máu', category: 'coagulation', code: 'COAG-001', normalRange: '11-13.5', unit: 'giây' }
    ];

    for (const medicalRecord of medicalRecords) {
      // 1-2 lab tests per medical record
      const testCount = Math.floor(Math.random() * 2) + 1;
      for (let l = 0; l < testCount; l++) {
        const test = labTests[(labTestCount + l) % labTests.length];
        const status = Math.random() > 0.3 ? 'completed' : 'pending';

        await LabTest.create({
          medicalRecordId: medicalRecord.id,
          patientId: medicalRecord.patientId,
          testName: test.name,
          testCode: test.code,
          testCategory: test.category,
          orderedDate: medicalRecord.visitDate,
          orderedBy: medicalRecord.doctorId,
          performedDate: status === 'completed' ? new Date(medicalRecord.visitDate.getTime() + 1 * 24 * 60 * 60 * 1000) : null,
          resultDate: status === 'completed' ? new Date(medicalRecord.visitDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
          resultValue: status === 'completed' ? 'Bình thường' : null,
          normalRange: test.normalRange,
          unit: test.unit,
          status: status,
          interpretation: status === 'completed' ? 'Kết quả trong giới hạn bình thường' : 'Chờ kỹ thuật viên thực hiện',
          notes: status === 'completed' ? 'Kết quả không bất thường' : 'Chờ xử lý'
        });
        labTestCount++;
      }
    }
    console.log(`✓ Lab tests created (${labTestCount})`);

    // ============= CREATE APPOINTMENTS =============
    let appointmentCount = 0;
    const statuses = ['pending', 'confirmed', 'completed'];
    
    for (let i = 0; i < patientProfiles.length; i++) {
      const patientProfile = patientProfiles[i];
      const doctor = doctors[i % doctors.length];
      
      // 1-3 appointments per patient
      const aptCount = (i % 3) + 1;
      for (let a = 0; a < aptCount; a++) {
        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + (a * 7 - 10));
        appointmentDate.setHours(9 + a * 2);

        await Appointment.create({
          patientId: patientProfile.id,
          doctorId: doctor.id,
          appointmentDate: appointmentDate,
          status: statuses[a % statuses.length],
          reason: ['Tái khám', 'Khám sơ cấp', 'Kiểm tra định kỳ'][a % 3],
          notes: `Lịch khám lần ${a + 1} cho bệnh nhân`
        });
        appointmentCount++;
      }
    }
    console.log(`✓ Appointments created (${appointmentCount})`);

    // ============= CREATE PATIENT DOCUMENTS =============
    let documentCount = 0;
    const documentTypes = ['xray', 'ct', 'ultrasound', 'ecg', 'lab_result', 'report'];
    
    for (let i = 0; i < medicalRecords.length; i++) {
      const medicalRecord = medicalRecords[i];
      // 0-2 documents per medical record
      const docCount = Math.floor(Math.random() * 2);
      
      for (let d = 0; d < docCount; d++) {
        const docType = documentTypes[i % documentTypes.length];
        const docNames = {
          xray: 'X-quang ngực',
          ct: 'CT scan',
          ultrasound: 'Siêu âm tim',
          ecg: 'Điện tim',
          lab_result: 'Kết quả xét nghiệm',
          report: 'Báo cáo khám'
        };

        await PatientDocument.create({
          medicalRecordId: medicalRecord.id,
          patientId: medicalRecord.patientId,
          documentType: docType,
          title: docNames[docType],
          description: `Tài liệu ${docNames[docType]} từ lần khám ngày ${medicalRecord.visitDate.toLocaleDateString('vi-VN')}`,
          fileUrl: `/uploads/documents/${medicalRecord.id}/${docNames[docType]}.pdf`,
          fileName: `${docNames[docType]}.pdf`,
          fileSize: 1024 * (50 + Math.random() * 950),
          mimeType: 'application/pdf',
          uploadedBy: medicalRecord.doctorId,
          uploadDate: new Date(medicalRecord.visitDate.getTime() + 1 * 60 * 60 * 1000),
          examDate: medicalRecord.visitDate,
          status: 'confirmed',
          notes: 'Tài liệu y tế chính thức'
        });
        documentCount++;
      }
    }
    console.log(`✓ Patient documents created (${documentCount})`);

    // ============= CREATE SYSTEM SETTINGS =============
    const systemSettings = await SystemSettings.create({
      appName: 'QLBA - Electronic Health Record System',
      appVersion: '2.0.0',
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

    // ============= CREATE USER PREFERENCES =============
    let preferencesCount = 0;
    const allUsers = [adminUser, doctor1, doctor2, doctor3, doctor4, doctor5, ...patientUsers];
    
    for (const user of allUsers) {
      await UserPreference.create({
        userId: user.id,
        theme: 'light',
        language: 'vi',
        notifications: true,
        emailNotifications: user.role === 'doctor' ? true : true,
        smsNotifications: user.role === 'patient' ? true : false,
        autoBackup: user.role === 'admin' ? true : false,
        backupFrequency: 'daily'
      });
      preferencesCount++;
    }
    console.log(`✓ User preferences created (${preferencesCount})`);

    // ============= CREATE ACTIVITIES =============
    const activities = [
      { type: 'login', description: 'Admin đăng nhập vào hệ thống', user: adminUser.email, details: 'Đăng nhập thành công', ipAddress: '127.0.0.1' },
      { type: 'login', description: 'Doctor 1 đăng nhập vào hệ thống', user: doctor1.email, details: 'Đăng nhập thành công', ipAddress: '127.0.0.1' },
      { type: 'view', description: 'Doctor 1 xem dashboard', user: doctor1.email, details: 'Xem tổng quan bảng điều khiển', ipAddress: '127.0.0.1' },
      { type: 'create', description: 'Doctor 1 tạo hồ sơ bệnh án', user: doctor1.email, details: 'Tạo hồ sơ bệnh án mới cho bệnh nhân', ipAddress: '127.0.0.1' },
      { type: 'update', description: 'Doctor 1 cập nhật hồ sơ bệnh án', user: doctor1.email, details: 'Cập nhật chẩn đoán và điều trị', ipAddress: '127.0.0.1' },
      { type: 'create', description: 'Doctor 1 tạo đơn thuốc', user: doctor1.email, details: 'Tạo đơn thuốc cho bệnh nhân', ipAddress: '127.0.0.1' },
      { type: 'login', description: 'Patient 1 đăng nhập vào hệ thống', user: patientUsers[0].email, details: 'Đăng nhập thành công', ipAddress: '127.0.0.1' },
      { type: 'view', description: 'Patient 1 xem hồ sơ bệnh án', user: patientUsers[0].email, details: 'Xem hồ sơ bệnh án của mình', ipAddress: '127.0.0.1' },
      { type: 'create', description: 'Doctor 2 tạo hồ sơ bệnh án', user: doctor2.email, details: 'Tạo hồ sơ bệnh án cho bệnh nhân khác', ipAddress: '127.0.0.1' },
      { type: 'update', description: 'Admin cập nhật cài đặt hệ thống', user: adminUser.email, details: 'Cập nhật cài đặt hệ thống', ipAddress: '127.0.0.1' },
      { type: 'view', description: 'Doctor 3 xem danh sách bệnh nhân', user: doctor3.email, details: 'Xem danh sách bệnh nhân được gán', ipAddress: '127.0.0.1' },
      { type: 'create', description: 'Doctor 3 kỷ định xét nghiệm', user: doctor3.email, details: 'Chỉ định xét nghiệm cho bệnh nhân', ipAddress: '127.0.0.1' },
      { type: 'view', description: 'Patient 2 xem đơn thuốc', user: patientUsers[1].email, details: 'Xem danh sách toa thuốc', ipAddress: '127.0.0.1' },
      { type: 'view', description: 'Patient 3 xem lịch khám', user: patientUsers[2].email, details: 'Xem lịch khám của mình', ipAddress: '127.0.0.1' },
      { type: 'update', description: 'Doctor 4 cập nhật kết quả xét nghiệm', user: doctor4.email, details: 'Cập nhật kết quả xét nghiệm', ipAddress: '127.0.0.1' }
    ];

    let activityCount = 0;
    for (const activity of activities) {
      await Activity.create(activity);
      activityCount++;
    }
    console.log(`✓ Activities created (${activityCount})`);

    // ============= CREATE SYSTEM LOGS =============
    const systemLogs = [
      { type: 'INFO', user: 'system', action: 'Database initialized', details: 'Cơ sở dữ liệu được khởi tạo', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: 'system', action: 'Server started', details: 'Server đã khởi động', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: adminUser.email, action: 'User login', details: 'Admin đăng nhập', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: doctor1.email, action: 'User login', details: 'Doctor 1 đăng nhập', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: doctor1.email, action: 'Create medical record', details: 'Tạo hồ sơ bệnh án', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: doctor1.email, action: 'Create prescription', details: 'Tạo đơn thuốc', ipAddress: '127.0.0.1' },
      { type: 'WARNING', user: 'system', action: 'High database load', details: 'Tải cơ sở dữ liệu cao', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: patientUsers[0].email, action: 'User login', details: 'Bệnh nhân đăng nhập', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: 'system', action: 'Backup completed', details: 'Sao lưu hoàn thành', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: adminUser.email, action: 'System settings updated', details: 'Cài đặt hệ thống được cập nhật', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: doctor2.email, action: 'Create lab test order', details: 'Chỉ định xét nghiệm', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: doctor3.email, action: 'Update lab test result', details: 'Cập nhật kết quả xét nghiệm', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: doctor4.email, action: 'Create appointment', details: 'Tạo lịch khám', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: 'system', action: 'Data validation completed', details: 'Kiểm tra tính toàn vẹn dữ liệu thành công', ipAddress: '127.0.0.1' },
      { type: 'INFO', user: adminUser.email, action: 'User management', details: 'Quản lý người dùng hệ thống', ipAddress: '127.0.0.1' }
    ];

    let logCount = 0;
    for (const log of systemLogs) {
      await SystemLog.create(log);
      logCount++;
    }
    console.log(`✓ System logs created (${logCount})`);

    // ============= SUMMARY =============
    console.log('\n✅ ========================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('✅ ========================================');
    console.log(`
✓ Users Created:
  - 1 Admin account (admin@qlba.com)
  - 5 Doctor accounts (bacsi01-05@email.com)
  - 11 Patient accounts (bnh01-11@email.com)

✓ Core Medical Data:
  - 11 Medical Histories (Bệnh sử bệnh nhân)
  - ${medicalRecords.length} Medical Records (Bệnh án khám)
  - ${medicalRecords.length} Vital Signs (Dấu hiệu sinh tồn)
  - ${prescriptionCount} Prescriptions (Toa thuốc)
  - ${labTestCount} Lab Tests (Xét nghiệm)
  - ${appointmentCount} Appointments (Lịch khám)
  - ${documentCount} Patient Documents (Tài liệu y tế)

✓ System Data:
  - ${preferencesCount} User Preferences (Tuỳ chọn người dùng)
  - ${activityCount} Activities (Hoạt động)
  - ${logCount} System Logs (Nhật ký hệ thống)
  - 1 System Settings (Cài đặt hệ thống)

✓ Features Implemented:
  ✓ Medical History (Bệnh sử cũ, dị ứng, tiền sử gia đình)
  ✓ Vital Signs (Huyết áp, nhịp tim, nhiệt độ, BMI, khám lâm sàng)
  ✓ Patient Documents (Upload/lưu trữ hình ảnh, tài liệu)
  ✓ Lab Test Details (Công thức xét nghiệm, giá trị bình thường, diễn giải)
  ✓ Medical Record Enhancements (Follow-up tracking, diagnoses chi tiết)
  ✓ Comprehensive Activity & Audit Logging
  ✓ User Preferences & System Configuration

✓ Test Accounts:
  Admin: admin@qlba.com (password: Admin@123456)
  Doctors: bacsi01-05@email.com (password: 123456)
  Patients: bnh01-11@email.com (password: 123456)

✓ Total Records Created: ${medicalRecords.length + prescriptionCount + labTestCount + appointmentCount + documentCount + preferencesCount + activityCount + logCount + 1}
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
