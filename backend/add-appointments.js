const { Appointment, Doctor, Patient } = require('./models');

async function addAppointments() {
  try {
    console.log('Adding appointments with different statuses...');

    // Get doctors and patients
    const doctors = await Doctor.findAll({ limit: 3 });
    const patients = await Patient.findAll({ limit: 6 });

    if (doctors.length < 3 || patients.length < 6) {
      console.log('Not enough doctors or patients found');
      return;
    }

    // Add pending appointments (chờ xác nhận)
    const apt1 = await Appointment.create({
      patientId: patients[0].id,
      doctorId: doctors[0].id,
      appointmentDate: new Date('2024-11-25 10:00:00'),
      status: 'pending',
      reason: 'Tái khám kiểm tra huyết áp',
      notes: 'Chuẩn bị máu sơ cấp và máu glucose'
    });
    console.log('✓ Added pending appointment: ' + patients[0].user?.firstName);

    const apt2 = await Appointment.create({
      patientId: patients[1].id,
      doctorId: doctors[1].id,
      appointmentDate: new Date('2024-11-26 14:00:00'),
      status: 'pending',
      reason: 'Kiểm tra đái tháo đường',
      notes: 'Cần xét nghiệm HbA1c'
    });
    console.log('✓ Added pending appointment: ' + patients[1].user?.firstName);

    // Add confirmed appointments (đã xác nhận)
    const apt3 = await Appointment.create({
      patientId: patients[2].id,
      doctorId: doctors[0].id,
      appointmentDate: new Date('2024-11-24 09:30:00'),
      status: 'confirmed',
      reason: 'Tái khám trẻ em',
      notes: 'Kiểm tra phát triển'
    });
    console.log('✓ Added confirmed appointment: ' + patients[2].user?.firstName);

    const apt4 = await Appointment.create({
      patientId: patients[3].id,
      doctorId: doctors[2].id,
      appointmentDate: new Date('2024-11-23 11:00:00'),
      status: 'confirmed',
      reason: 'Khám da liễu định kỳ',
      notes: 'Kiểm tra viêm da'
    });
    console.log('✓ Added confirmed appointment: ' + patients[3].user?.firstName);

    // Add completed appointments (đã hoàn thành)
    const apt5 = await Appointment.create({
      patientId: patients[4].id,
      doctorId: doctors[1].id,
      appointmentDate: new Date('2024-11-20 15:00:00'),
      status: 'completed',
      reason: 'Tái khám viêm họng',
      notes: 'Kết quả tốt'
    });
    console.log('✓ Added completed appointment: ' + patients[4].user?.firstName);

    const apt6 = await Appointment.create({
      patientId: patients[5].id,
      doctorId: doctors[2].id,
      appointmentDate: new Date('2024-11-19 10:00:00'),
      status: 'completed',
      reason: 'Tái khám phế quản',
      notes: 'Bệnh đã ổn định'
    });
    console.log('✓ Added completed appointment: ' + patients[5].user?.firstName);

    console.log('\n✅ Successfully added 6 appointments with different statuses:');
    console.log('  - 2 pending (chờ xác nhận)');
    console.log('  - 2 confirmed (đã xác nhận)');
    console.log('  - 2 completed (đã hoàn thành)');

  } catch (error) {
    console.error('Error adding appointments:', error);
  } finally {
    process.exit(0);
  }
}

addAppointments();
