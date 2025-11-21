const sequelize = require('../config/database');
const User = require('./User');
const Patient = require('./Patient');
const MedicalRecord = require('./MedicalRecord');
const Prescription = require('./Prescription');
const LabTest = require('./LabTest');
const Appointment = require('./Appointment');
const Doctor = require('./Doctor');
const SystemLog = require('./SystemLog')(sequelize);
const Activity = require('./Activity')(sequelize);
const SystemSettings = require('./SystemSettings')(sequelize);
const UserPreference = require('./UserPreference')(sequelize);

// Define associations
User.hasMany(Patient, { foreignKey: 'userId', as: 'patients' });
Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctor' });
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(MedicalRecord, { foreignKey: 'doctorId', as: 'medicalRecords' });
MedicalRecord.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

Patient.hasMany(MedicalRecord, { foreignKey: 'patientId', as: 'records' });
MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

MedicalRecord.hasMany(Prescription, { foreignKey: 'medicalRecordId', as: 'prescriptions' });
Prescription.belongsTo(MedicalRecord, { foreignKey: 'medicalRecordId', as: 'medicalRecord' });

Patient.hasMany(Prescription, { foreignKey: 'patientId', as: 'allPrescriptions' });
Prescription.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

MedicalRecord.hasMany(LabTest, { foreignKey: 'medicalRecordId', as: 'labTests' });
LabTest.belongsTo(MedicalRecord, { foreignKey: 'medicalRecordId', as: 'medicalRecord' });

Patient.hasMany(LabTest, { foreignKey: 'patientId', as: 'allLabTests' });
LabTest.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

// Appointment associations
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

User.hasOne(UserPreference, { foreignKey: 'userId', as: 'preferences' });
UserPreference.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Sync database
const syncDatabase = async () => {
  try {
    console.log('Syncing database...');
    
    // Only sync schema without dropping existing data
    await sequelize.sync({ force: false, alter: true });
    console.log('✓ Database synchronized successfully');
    return true;
  } catch (error) {
    console.error('✗ Error synchronizing database:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Patient,
  MedicalRecord,
  Prescription,
  LabTest,
  Appointment,
  SystemLog,
  Activity,
  SystemSettings,
  Doctor,
  UserPreference,
  syncDatabase
};
