const { LabTest, MedicalRecord } = require('./models');

async function addLabTests() {
  try {
    console.log('Adding lab tests with different statuses...');

    // Get all medical records
    const medicalRecords = await MedicalRecord.findAll({
      limit: 6,
      order: [['createdAt', 'ASC']]
    });

    if (medicalRecords.length < 6) {
      console.log('Not enough medical records found');
      return;
    }

    // Add pending lab test (chờ xác nhận)
    const labTestPending1 = await LabTest.create({
      medicalRecordId: medicalRecords[0].id,
      patientId: medicalRecords[0].patientId,
      testName: 'x quang',
      testCode: 'XQ-001',
      orderedDate: new Date('2024-11-21'),
      status: 'pending',
      notes: 'Chờ kỹ thuật viên thực hiện'
    });
    console.log('✓ Added pending lab test: x quang');

    // Add pending lab test
    const labTestPending2 = await LabTest.create({
      medicalRecordId: medicalRecords[1].id,
      patientId: medicalRecords[1].patientId,
      testName: 'Xét nghiệm glucose máu',
      testCode: 'GLU-002',
      orderedDate: new Date('2024-11-21'),
      status: 'pending',
      notes: 'Chờ lấy mẫu máu'
    });
    console.log('✓ Added pending lab test: Xét nghiệm glucose máu');

    // Add completed lab test (đã hoàn thành)
    const labTestCompleted = await LabTest.create({
      medicalRecordId: medicalRecords[2].id,
      patientId: medicalRecords[2].patientId,
      testName: 'Xét nghiệm máu toàn phần',
      testCode: 'CBC-002',
      orderedDate: new Date('2024-11-19'),
      resultDate: new Date('2024-11-20'),
      resultValue: 'Bình thường',
      normalRange: '4.5-11.0 (WBC)',
      unit: '10^9/L',
      status: 'completed',
      notes: 'Kết quả bình thường, không có bất thường'
    });
    console.log('✓ Added completed lab test: Xét nghiệm máu toàn phần');

    // Add abnormal lab test (bất thường)
    const labTestAbnormal = await LabTest.create({
      medicalRecordId: medicalRecords[3].id,
      patientId: medicalRecords[3].patientId,
      testName: 'Xét nghiệm cholesterol',
      testCode: 'CHOL-001',
      orderedDate: new Date('2024-11-18'),
      resultDate: new Date('2024-11-19'),
      resultValue: '280',
      normalRange: '<200',
      unit: 'mg/dL',
      status: 'abnormal',
      notes: 'Cholesterol cao, cần kiểm tra lại và điều trị'
    });
    console.log('✓ Added abnormal lab test: Xét nghiệm cholesterol');

    // Add another completed lab test
    const labTestCompleted2 = await LabTest.create({
      medicalRecordId: medicalRecords[4].id,
      patientId: medicalRecords[4].patientId,
      testName: 'Siêu âm tim',
      testCode: 'ECHO-001',
      orderedDate: new Date('2024-11-17'),
      resultDate: new Date('2024-11-18'),
      resultValue: 'Bình thường',
      status: 'completed',
      notes: 'Hình ảnh tim bình thường, chức năng tốt'
    });
    console.log('✓ Added completed lab test: Siêu âm tim');

    // Add another pending lab test
    const labTestPending3 = await LabTest.create({
      medicalRecordId: medicalRecords[5].id,
      patientId: medicalRecords[5].patientId,
      testName: 'CT scan ngực',
      testCode: 'CT-001',
      orderedDate: new Date('2024-11-21'),
      status: 'pending',
      notes: 'Chờ xếp lịch chụp'
    });
    console.log('✓ Added pending lab test: CT scan ngực');

    console.log('\n✅ Successfully added 6 lab tests with different statuses:');
    console.log('  - 3 pending (chờ xác nhận)');
    console.log('  - 2 completed (đã hoàn thành)');
    console.log('  - 1 abnormal (bất thường)');

  } catch (error) {
    console.error('Error adding lab tests:', error);
  } finally {
    process.exit(0);
  }
}

addLabTests();
