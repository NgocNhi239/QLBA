const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { syncDatabase } = require('./models');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/doctor', require('./routes/doctor-dashboard'));
app.use('/api/medical-records', require('./routes/medicalRecords'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/lab-tests', require('./routes/labTests'));
app.use('/api/diagnoses', require('./routes/diagnoses'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/medical-history', require('./routes/medicalHistory'));
app.use('/api/vital-signs', require('./routes/vitalSigns'));
app.use('/api/documents', require('./routes/documents'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
  process.exit(1);
});

module.exports = app;
