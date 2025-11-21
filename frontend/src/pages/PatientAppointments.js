import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/patient-dashboard.css';

const PatientAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Get patient profile first
      const patientRes = await fetch(`http://localhost:5000/api/patients/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const patientData = await patientRes.json();
      if (patientData.success) {
        // Get appointments
        const appointRes = await fetch(`http://localhost:5000/api/appointments/patient/${patientData.data.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const appointData = await appointRes.json();
        if (appointData.success) {
          setAppointments(appointData.data || []);
        }
      }
    } catch (err) {
      setError('Lỗi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="patient-dashboard-content">
          <h2>📅 Lịch khám của tôi</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="patient-section">
            {appointments.length === 0 ? (
              <p className="no-data">Chưa có lịch khám nào</p>
            ) : (
              <div className="appointments-list">
                {appointments.map(apt => (
                  <div key={apt.id} className="appointment-item">
                    <div className="apt-left">
                      <div className="apt-date">
                        📅 {new Date(apt.appointmentDate).toLocaleString('vi-VN')}
                      </div>
                      <div className="apt-doctor">
                        👨‍⚕️ Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}
                      </div>
                    </div>
                    <div className="apt-middle">
                      {apt.reason && (
                        <div className="apt-reason">
                          <strong>Lý do:</strong> {apt.reason}
                        </div>
                      )}
                      {apt.notes && (
                        <div className="apt-notes">
                          <strong>Ghi chú:</strong> {apt.notes}
                        </div>
                      )}
                    </div>
                    <div className="apt-right">
                      <button
                        className="btn-view"
                        onClick={() => setSelectedAppointment(apt)}
                        style={{padding: '0.5rem 1rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem'}}
                      >
                        Xem chi tiết
                      </button>
                      <span className={`apt-status ${apt.status?.toLowerCase()}`}>
                        {apt.status === 'pending' && '⏳ Chờ xác nhận'}
                        {apt.status === 'confirmed' && '✓ Đã xác nhận'}
                        {apt.status === 'completed' && '✓ Đã hoàn thành'}
                        {apt.status === 'cancelled' && '✗ Đã hủy'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointment Detail Modal */}
          {selectedAppointment && (
            <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
              <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <h3>📅 Chi tiết Lịch khám</h3>
                  <button onClick={() => setSelectedAppointment(null)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>✕</button>
                </div>
                <div style={{lineHeight: '1.8'}}>
                  <p><strong>Thời gian:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleString('vi-VN')}</p>
                  <p><strong>Bác sĩ:</strong> {selectedAppointment.doctor?.user?.firstName} {selectedAppointment.doctor?.user?.lastName}</p>
                  <p><strong>Trạng thái:</strong> 
                    <span style={{marginLeft: '0.5rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: selectedAppointment.status === 'confirmed' ? '#d1ecf1' : selectedAppointment.status === 'pending' ? '#fff3cd' : '#d4edda'}}>
                      {selectedAppointment.status === 'pending' ? '⏳ Chờ xác nhận' : selectedAppointment.status === 'confirmed' ? '✓ Đã xác nhận' : '✓ Đã hoàn thành'}
                    </span>
                  </p>
                  {selectedAppointment.reason && (
                    <p><strong>Lý do:</strong> {selectedAppointment.reason}</p>
                  )}
                  {selectedAppointment.notes && (
                    <p><strong>Ghi chú:</strong> {selectedAppointment.notes}</p>
                  )}
                </div>
                <button onClick={() => setSelectedAppointment(null)} style={{marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Đóng</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
