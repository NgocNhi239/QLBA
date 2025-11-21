const { User, Patient, Doctor, MedicalRecord, Prescription, LabTest } = require('./models');

async function addMoreData() {
  try {
    console.log('Adding more sample data with multiple patients and medical records...');

    // Get existing doctor
    const doctor = await Doctor.findOne();
    if (!doctor) {
      console.log('No doctor found');
      return;
    }

    // Create 5 more patient users
    const patients = [];
    for (let i = 7; i <= 11; i++) {
      const patientUser = await User.create({
        email: `patient${i}@qlba.com`,
        password: 'patient123',
        firstName: `Bệnh nhân`,
        lastName: `${i}`,
        role: 'patient',
        phone: `09${Math.random().toString().slice(2, 10)}`,
        address: `Địa chỉ bệnh nhân ${i}, Thành phố`
      });

      const patientProfile = await Patient.create({
        userId: patientUser.id,
        medicalRecordNumber: `MRN-2024-${String(i).padStart(3, '0')}`,
        dateOfBirth: new Date(`1980-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`),
        bloodType: ['O', 'A', 'B', 'AB', 'O+'][i % 5],
        allergies: i % 2 === 0 ? 'Dị ứng Penicillin' : 'Không có',
        address: `Địa chỉ bệnh nhân ${i}, Thành phố`
      });

      patients.push({ user: patientUser, profile: patientProfile });
      console.log(`✓ Created patient ${i}: ${patientUser.email}`);
    }

    // Create multiple medical records for each patient
    let recordCount = 0;
    for (const patient of patients) {
      // Each patient has 2-3 medical records
      const recordCount_ = Math.floor(Math.random() * 2) + 2;
      
      for (let r = 0; r < recordCount_; r++) {
        const visitDate = new Date();
        visitDate.setDate(visitDate.getDate() - (r * 5));

        const diagnoses = [
          { primary: 'Cảm lạnh', detail: 'Cảm lạnh thông thường', treatment: 'Uống thuốc hạ sốt, nghỉ ngơi' },
          { primary: 'Viêm họng', detail: 'Viêm họng cấp', treatment: 'Uống thuốc kháng sinh' },
          { primary: 'Đau đầu', detail: 'Đau đầu tension', treatment: 'Uống thuốc giảm đau' },
          { primary: 'Tiểu đường', detail: 'Tiểu đường type 2', treatment: 'Dùng insulin, kiểm soát chế độ ăn' },
          { primary: 'Cao huyết áp', detail: 'Cao huyết áp giai đoạn 1', treatment: 'Dùng thuốc huyết áp' },
          { primary: 'Viêm dạ dày', detail: 'Viêm dạ dày mãn tính', treatment: 'Uống thuốc dạ dày' },
          { primary: 'Bệnh tim', detail: 'Hẹp van tim', treatment: 'Theo dõi định kỳ' }
        ];

        const diagnosis = diagnoses[(patient.profile.id.charCodeAt(0) + r) % diagnoses.length];

        const medicalRecord = await MedicalRecord.create({
          patientId: patient.profile.id,
          doctorId: doctor.userId,
          visitDate: visitDate,
          department: 'Khám tổng quát',
          reason: `Khám ${diagnosis.primary}`,
          symptoms: `Triệu chứng liên quan đến ${diagnosis.primary}`,
          clinicalExamination: 'Bình thường',
          diagnosis: diagnosis.detail,
          primaryDiagnosis: diagnosis.primary,
          treatment: diagnosis.treatment,
          examResult: 'Bình thường',
          notes: `Ghi chú khám lần ${r + 1}`,
          status: 'completed'
        });

        recordCount++;
        console.log(`  ✓ Created medical record ${r + 1} for patient ${patient.user.email}`);

        // Create 1-2 prescriptions per medical record
        const prescriptionCount = Math.floor(Math.random() * 2) + 1;
        for (let p = 0; p < prescriptionCount; p++) {
          const medications = [
            { name: 'Paracetamol', dosage: '500mg', frequency: '3 lần/ngày', duration: '5 ngày' },
            { name: 'Ibuprofen', dosage: '400mg', frequency: '2 lần/ngày', duration: '7 ngày' },
            { name: 'Amoxicillin', dosage: '500mg', frequency: '3 lần/ngày', duration: '7 ngày' },
            { name: 'Omeprazole', dosage: '20mg', frequency: '1 lần/ngày', duration: '14 ngày' },
            { name: 'Metformin', dosage: '500mg', frequency: '2 lần/ngày', duration: '30 ngày' },
            { name: 'Lisinopril', dosage: '10mg', frequency: '1 lần/ngày', duration: '30 ngày' }
          ];

          const med = medications[(recordCount + p) % medications.length];

          await Prescription.create({
            medicalRecordId: medicalRecord.id,
            patientId: patient.profile.id,
            medicationName: med.name,
            dosage: med.dosage,
            quantity: parseInt(med.dosage) * (med.frequency === '1 lần/ngày' ? 30 : med.frequency === '2 lần/ngày' ? 60 : 90),
            unit: 'viên',
            frequency: med.frequency,
            duration: med.duration,
            route: 'Uống',
            instructions: `Uống ${med.frequency}`,
            status: 'active'
          });
        }

        // Create 1-2 lab tests per medical record
        const labTestCount = Math.floor(Math.random() * 2) + 1;
        for (let l = 0; l < labTestCount; l++) {
          const tests = [
            { name: 'Xét nghiệm máu toàn phần', status: 'completed', result: 'Bình thường' },
            { name: 'Xét nghiệm glucose máu', status: 'completed', result: '110 mg/dL' },
            { name: 'Xét nghiệm cholesterol', status: 'completed', result: '200 mg/dL' },
            { name: 'Siêu âm tim', status: 'completed', result: 'Bình thường' },
            { name: 'X-quang ngực', status: 'pending', result: null },
            { name: 'CT scan', status: 'pending', result: null }
          ];

          const test = tests[(recordCount + l) % tests.length];

          await LabTest.create({
            medicalRecordId: medicalRecord.id,
            patientId: patient.profile.id,
            testName: test.name,
            orderedDate: visitDate,
            resultDate: test.status === 'completed' ? new Date() : null,
            resultValue: test.result,
            status: test.status,
            notes: test.status === 'completed' ? 'Kết quả bình thường' : 'Chờ xử lý'
          });
        }
      }
    }

    console.log(`\n✅ Successfully added more sample data:`);
    console.log(`  - 5 new patient accounts`);
    console.log(`  - ${recordCount} medical records total`);
    console.log(`  - Multiple prescriptions and lab tests per record`);
    console.log(`\nNew test patients created:`);
    for (let i = 7; i <= 11; i++) {
      console.log(`  - patient${i}@qlba.com / patient123`);
    }

  } catch (error) {
    console.error('Error adding more data:', error);
  } finally {
    process.exit(0);
  }
}

addMoreData();
