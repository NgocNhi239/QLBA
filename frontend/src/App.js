import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatients from './pages/DoctorPatients';
import DoctorMedicalRecords from './pages/DoctorMedicalRecords';
import DoctorPrescriptions from './pages/DoctorPrescriptions';
import DoctorLabTests from './pages/DoctorLabTests';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorBenhAn from './pages/DoctorBenhAn';
import PatientDashboard from './pages/PatientDashboard';
import PatientMedicalHistory from './pages/PatientMedicalHistory';
import PatientPrescriptions from './pages/PatientPrescriptions';
import PatientLabTests from './pages/PatientLabTests';
import PatientAppointments from './pages/PatientAppointments';
import PatientHealthRecords from './pages/PatientHealthRecords';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminDoctorManagement from './pages/AdminDoctorManagement';
import AdminReports from './pages/AdminReports';
import AdminActivities from './pages/AdminActivities';
import AdminSystemSettings from './pages/AdminSystemSettings';
import PatientList from './pages/PatientList';
import './styles/index.css';

const PrivateRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { token, user } = React.useContext(AuthContext);
  return token && user?.role === 'admin' ? children : <Navigate to="/login" />;
};

const DoctorRoute = ({ children }) => {
  const { token, user } = React.useContext(AuthContext);
  return token && user?.role === 'doctor' ? children : <Navigate to="/login" />;
};

const PatientRoute = ({ children }) => {
  const { token, user } = React.useContext(AuthContext);
  return token && user?.role === 'patient' ? children : <Navigate to="/login" />;
};

const RoleBasedDashboard = () => {
  const { user } = React.useContext(AuthContext);

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      return <Dashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <RoleBasedDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <PrivateRoute>
                <PatientList />
              </PrivateRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <AdminRoute>
                <AdminDoctorManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <AdminReports />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/activities"
            element={
              <AdminRoute>
                <AdminActivities />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSystemSettings />
              </AdminRoute>
            }
          />
          
          {/* Doctor Routes */}
          <Route
            path="/doctor/patients"
            element={
              <DoctorRoute>
                <DoctorPatients />
              </DoctorRoute>
            }
          />
          <Route
            path="/doctor/patients/:patientId/records"
            element={
              <DoctorRoute>
                <DoctorMedicalRecords />
              </DoctorRoute>
            }
          />
          <Route
            path="/doctor/prescriptions"
            element={
              <DoctorRoute>
                <DoctorPrescriptions />
              </DoctorRoute>
            }
          />
          <Route
            path="/doctor/lab-tests"
            element={
              <DoctorRoute>
                <DoctorLabTests />
              </DoctorRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <DoctorRoute>
                <DoctorAppointments />
              </DoctorRoute>
            }
          />
          <Route
            path="/doctor/benh-an"
            element={
              <DoctorRoute>
                <DoctorBenhAn />
              </DoctorRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="/medical-history"
            element={
              <PatientRoute>
                <PatientMedicalHistory />
              </PatientRoute>
            }
          />
          <Route
            path="/my-prescriptions"
            element={
              <PatientRoute>
                <PatientPrescriptions />
              </PatientRoute>
            }
          />
          <Route
            path="/my-tests"
            element={
              <PatientRoute>
                <PatientLabTests />
              </PatientRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PatientRoute>
                <PatientAppointments />
              </PatientRoute>
            }
          />
          <Route
            path="/health-records"
            element={
              <PatientRoute>
                <PatientHealthRecords />
              </PatientRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
