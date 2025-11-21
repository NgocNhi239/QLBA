const { User, Patient, MedicalRecord, Prescription, LabTest, SystemLog, Activity, SystemSettings, sequelize } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Helper: Log activity
const logActivity = async (type, description, user, details, ipAddress) => {
  try {
    await Activity.create({
      type,
      description,
      user,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Helper: Get client IP
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
};

// ============ USER MANAGEMENT ============

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Patient,
          as: 'patients',
          attributes: ['id', 'medicalRecordNumber']
        }
      ]
    });

    await logActivity('create', 'View all users', req.user.email, `Retrieved ${users.length} users`, getClientIp(req));

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Patient,
          as: 'patients'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldData = {
      name: user.name,
      email: user.email,
      role: user.role
    };

    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      address: address || user.address,
      role: role || user.role
    });

    await logActivity(
      'update',
      `Updated user ${user.email}`,
      req.user.email,
      `Changed from ${JSON.stringify(oldData)} to ${JSON.stringify({ name, email, role })}`,
      getClientIp(req)
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const email = user.email;
    await user.destroy();

    await logActivity(
      'delete',
      `Deleted user ${email}`,
      req.user.email,
      `User ID: ${req.params.id}`,
      getClientIp(req)
    );

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// ============ STATISTICS ============

exports.getAllStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalPatients = await Patient.count();
    const totalDoctors = await User.count({ where: { role: 'doctor' } });
    const totalMedicalRecords = await MedicalRecord.count();
    const totalPrescriptions = await Prescription.count();
    const totalLabTests = await LabTest.count();
    const activeUsers = await User.count({
      where: {
        updatedAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    // Monthly growth (last 12 months)
    const monthlyGrowth = [];
    for (let i = 11; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const count = await User.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      monthlyGrowth.push({
        month: startDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' }),
        users: count
      });
    }

    await logActivity(
      'report',
      'Generated statistics report',
      req.user.email,
      'System statistics retrieved',
      getClientIp(req)
    );

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPatients,
        totalDoctors,
        totalMedicalRecords,
        totalPrescriptions,
        totalLabTests,
        activeUsers,
        monthlyGrowth
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics',
      error: error.message
    });
  }
};

// ============ REPORTS ============

exports.getReports = async (req, res) => {
  try {
    const { type, start, end } = req.query;
    let data = [];

    const whereClause = {};
    if (start && end) {
      whereClause.createdAt = {
        [Op.between]: [new Date(start), new Date(end)]
      };
    }

    switch (type) {
      case 'overview':
        const totalUsers = await User.count();
        const totalPatients = await Patient.count();
        const totalDoctors = await User.count({ where: { role: 'doctor' } });
        const totalMedicalRecords = await MedicalRecord.count();
        const totalPrescriptions = await Prescription.count();
        const totalLabTests = await LabTest.count();
        
        data = [{
          'Tổng Users': totalUsers,
          'Tổng Bệnh nhân': totalPatients,
          'Tổng Bác sĩ': totalDoctors,
          'Tổng Hồ sơ y tế': totalMedicalRecords,
          'Tổng Đơn thuốc': totalPrescriptions,
          'Tổng Xét nghiệm': totalLabTests
        }];
        break;

      case 'users':
        data = await User.findAll({
          where: whereClause,
          attributes: { exclude: ['password'] },
          raw: true
        });
        // Format data for display
        data = data.map(u => ({
          'ID': u.id,
          'Họ': u.firstName,
          'Tên': u.lastName,
          'Email': u.email,
          'Vai trò': u.role,
          'Điện thoại': u.phone,
          'Địa chỉ': u.address,
          'Ngày tạo': new Date(u.createdAt).toLocaleDateString('vi-VN')
        }));
        break;

      case 'patients':
        data = await Patient.findAll({
          where: whereClause,
          include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }],
          raw: true,
          subQuery: false
        });
        data = data.map(p => ({
          'ID': p.id,
          'Mã hồ sơ': p.medicalRecordNumber,
          'Bệnh nhân': `${p['user.firstName']} ${p['user.lastName']}`,
          'Email': p['user.email'],
          'Ngày sinh': p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('vi-VN') : '',
          'Giới tính': p.gender,
          'Ngày tạo': new Date(p.createdAt).toLocaleDateString('vi-VN')
        }));
        break;

      case 'medical-records':
        data = await MedicalRecord.findAll({
          where: whereClause,
          include: [
            { model: Patient, as: 'patient', attributes: ['medicalRecordNumber'], include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] },
            { model: User, as: 'doctor', attributes: ['firstName', 'lastName'] }
          ],
          raw: true,
          subQuery: false
        });
        data = data.map(m => ({
          'ID': m.id,
          'Mã hồ sơ': m['patient.medicalRecordNumber'],
          'Bác sĩ': `${m['doctor.firstName']} ${m['doctor.lastName']}`,
          'Chẩn đoán': m.diagnosis,
          'Chuẩn đoán chính': m.primaryDiagnosis,
          'Ngày khám': new Date(m.visitDate).toLocaleDateString('vi-VN')
        }));
        break;

      case 'prescriptions':
        data = await Prescription.findAll({
          where: whereClause,
          include: [{ model: Patient, as: 'patient', attributes: ['medicalRecordNumber'], include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] }],
          raw: true,
          subQuery: false
        });
        data = data.map(p => ({
          'ID': p.id,
          'Bệnh nhân': `${p['patient.user.firstName']} ${p['patient.user.lastName']}`,
          'Mã hồ sơ': p['patient.medicalRecordNumber'],
          'Tên thuốc': p.medicationName,
          'Liều lượng': p.dosage,
          'Tần suất': p.frequency,
          'Thời hạn': p.duration,
          'Ngày cấp': new Date(p.createdAt).toLocaleDateString('vi-VN')
        }));
        break;

      case 'lab-tests':
        data = await LabTest.findAll({
          where: whereClause,
          include: [{ model: Patient, as: 'patient', attributes: ['medicalRecordNumber'], include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] }],
          raw: true,
          subQuery: false
        });
        data = data.map(l => ({
          'ID': l.id,
          'Bệnh nhân': `${l['patient.user.firstName']} ${l['patient.user.lastName']}`,
          'Mã hồ sơ': l['patient.medicalRecordNumber'],
          'Tên xét nghiệm': l.testName,
          'Kết quả': l.result,
          'Tình trạng': l.status,
          'Ngày xét': new Date(l.createdAt).toLocaleDateString('vi-VN')
        }));
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    await logActivity(
      'report',
      `Generated ${type || 'overview'} report`,
      req.user.email,
      `Date range: ${start} to ${end}`,
      getClientIp(req)
    );

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
};

// ============ SYSTEM SETTINGS ============

exports.getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = await SystemSettings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving settings',
      error: error.message
    });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    await settings.update(req.body);

    await logActivity(
      'settings',
      'Updated system settings',
      req.user.email,
      JSON.stringify(req.body),
      getClientIp(req)
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// ============ BACKUP ============

exports.performBackup = async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../backups');

    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

    // Collect all data
    const backupData = {
      timestamp: new Date(),
      users: await User.findAll({ raw: true }),
      patients: await Patient.findAll({ raw: true }),
      medicalRecords: await MedicalRecord.findAll({ raw: true }),
      prescriptions: await Prescription.findAll({ raw: true }),
      labTests: await LabTest.findAll({ raw: true })
    };

    // Write backup file
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

    await logActivity(
      'settings',
      'Performed system backup',
      req.user.email,
      `Backup file: ${backupFile}`,
      getClientIp(req)
    );

    res.status(200).json({
      success: true,
      message: 'Backup performed successfully',
      backupFile: backupFile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing backup',
      error: error.message
    });
  }
};

// ============ LOGS ============

exports.getSystemLogs = async (req, res) => {
  try {
    // Get logs from Activity table which has more detailed info
    const logs = await Activity.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100,
      attributes: ['id', 'type', 'description', 'user', 'details', 'ipAddress', 'createdAt', 'timestamp']
    });

    // Map to expected format for frontend
    const formattedLogs = logs.map(log => ({
      id: log.id,
      type: log.type,
      action: log.description,
      user: log.user,
      details: log.details,
      timestamp: log.timestamp || log.createdAt
    }));

    res.status(200).json({
      success: true,
      data: formattedLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving logs',
      error: error.message
    });
  }
};

exports.clearSystemLogs = async (req, res) => {
  try {
    await SystemLog.destroy({ where: {} });

    await logActivity(
      'settings',
      'Cleared system logs',
      req.user.email,
      'All system logs deleted',
      getClientIp(req)
    );

    res.status(200).json({
      success: true,
      message: 'System logs cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing logs',
      error: error.message
    });
  }
};

// ============ ACTIVITIES ============

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      order: [['timestamp', 'DESC']],
      limit: 200
    });

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving activities',
      error: error.message
    });
  }
};
