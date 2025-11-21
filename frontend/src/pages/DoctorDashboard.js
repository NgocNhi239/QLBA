import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/doctor-dashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalPrescriptions: 0,
    totalLabTests: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Get stats
      const statsRes = await fetch('http://localhost:5000/api/doctor/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Get appointments
      const apptRes = await fetch('http://localhost:5000/api/appointments/doctor', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const apptData = await apptRes.json();
      if (apptData.success) {
        setAppointments(apptData.data.slice(0, 5));
      }

      // Get patients
      const patientsRes = await fetch('http://localhost:5000/api/medical-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const patientsData = await patientsRes.json();
      if (patientsData.success) {
        setRecentPatients(patientsData.data.slice(0, 3));
      }
    } catch (err) {
      setError('Lỗi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'medical-record':
        navigate('/doctor/benh-an');
        break;
      case 'prescription':
        navigate('/doctor/prescriptions');
        break;
      case 'lab-test':
        navigate('/doctor/lab-tests');
        break;
      case 'patients':
        navigate('/doctor/patients');
        break;
      default:
        break;
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="doctor-dashboard-content">
          <h2>👨‍⚕️ Bác sĩ Dashboard</h2>

          {error && <div className="error-message">{error}</div>}

          {/* Quick Stats */}
          <div className="doctor-section">
            <h3>📊 Thống kê</h3>
            <div className="doctor-stats">
              <div className="stat-box">
                <div className="stat-number">{stats.totalPatients}</div>
                <div className="stat-label">Bệnh nhân của tôi</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{stats.todayAppointments}</div>
                <div className="stat-label">Cuộc hẹn hôm nay</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{stats.totalPrescriptions}</div>
                <div className="stat-label">Toa thuốc đã cấp</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{stats.totalLabTests}</div>
                <div className="stat-label">Xét nghiệm đặt</div>
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          {appointments.length > 0 && (
            <div className="doctor-section">
              <h3>📅 Lịch khám sắp tới</h3>
              <div className="appointments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Bệnh nhân</th>
                      <th>Ngày giờ khám</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => (
                      <tr key={apt.id}>
                        <td>{apt.patient?.user?.firstName} {apt.patient?.user?.lastName}</td>
                        <td>{new Date(apt.appointmentDate).toLocaleString('vi-VN')}</td>
                        <td>
                          <span className={`status-badge ${apt.status?.toLowerCase()}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-small" onClick={() => navigate('/doctor/benh-an')}>
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Patients */}
          {recentPatients.length > 0 && (
            <div className="doctor-section">
              <h3>👥 Bệnh nhân gần đây</h3>
              <div className="recent-patients">
                {recentPatients.map(record => (
                  <div key={record.id} className="patient-card">
                    <div className="patient-header">
                      <div className="patient-name">
                        {record.patient?.user?.firstName} {record.patient?.user?.lastName}
                      </div>
                      <div className="patient-diagnosis">{record.primaryDiagnosis || 'Chưa có chẩn đoán'}</div>
                    </div>
                    <div className="patient-footer">
                      <small>Khám lần cuối: {new Date(record.createdAt).toLocaleDateString('vi-VN')}</small>
                      <button 
                        className="btn-small" 
                        onClick={() => navigate('/doctor/benh-an')}
                      >
                        Tạo bệnh án
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="doctor-section">
            <h3>🔧 Hành động nhanh</h3>
            <div className="doctor-actions">
              <button 
                className="action-btn-doctor" 
                onClick={() => handleQuickAction('medical-record')}
              >
                📋 Tạo bệnh án mới
              </button>
              <button 
                className="action-btn-doctor"
                onClick={() => handleQuickAction('prescription')}
              >
                💊 Tạo toa thuốc
              </button>
              <button 
                className="action-btn-doctor"
                onClick={() => handleQuickAction('lab-test')}
              >
                🧪 Đặt xét nghiệm
              </button>
              <button 
                className="action-btn-doctor"
                onClick={() => handleQuickAction('patients')}
              >
                👥 Quản lý bệnh nhân
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
