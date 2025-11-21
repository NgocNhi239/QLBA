const express = require('express');
const router = express.Router();
const { auth, authorizeRole } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllStats,
  getReports,
  getSystemSettings,
  updateSystemSettings,
  performBackup,
  getSystemLogs,
  clearSystemLogs,
  getActivities
} = require('../controllers/adminController');

// Middleware to check admin role
router.use(auth, authorizeRole('admin'));

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Statistics & Reports
router.get('/stats', getAllStats);
router.get('/reports', getReports);

// System Settings
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

// Backup
router.post('/backup', performBackup);

// Logs
router.get('/logs', getSystemLogs);
router.delete('/logs', clearSystemLogs);

// Activities
router.get('/activities', getActivities);

module.exports = router;
