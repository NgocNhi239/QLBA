import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/doctor-appointments.css';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/doctor/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        alert('Cập nhật trạng thái thành công!');
        fetchAppointments();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Lỗi cập nhật trạng thái');
      console.error(err);
    }
  };

  const filteredAppointments = filterStatus === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filterStatus);

  const handlePatientSearch = (value) => {
    setPatientSearchTerm(value);
    setShowPatientDropdown(true);
  };

  const uniquePatients = [];
  const seenPatientIds = new Set();
  appointments.forEach(apt => {
    if (apt.patientId && !seenPatientIds.has(apt.patientId)) {
      seenPatientIds.add(apt.patientId);
      uniquePatients.push(apt);
    }
  });

  const filteredPatients = uniquePatients.filter(apt => {
    if (!patientSearchTerm) return true;
    const searchLower = patientSearchTerm.toLowerCase();
    const fullName = `${apt.patient?.user?.firstName || ''} ${apt.patient?.user?.lastName || ''}`.toLowerCase();
    const phone = apt.patient?.user?.phone?.toLowerCase() || '';
    return fullName.includes(searchLower) || phone.includes(searchLower);
  });

  const displayedAppointments = patientSearchTerm
    ? filteredAppointments.filter(apt => 
        filteredPatients.some(p => p.patientId === apt.patientId)
      )
    : filteredAppointments;

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="appointments-container">
          <h1>📅 Lịch khám của bác sĩ</h1>

          {error && <div className="error-message">{error}</div>}

          {/* Patient Search Filter */}
          <div className="patient-search-section">
            <div className="searchable-patient-selector">
              <input
                type="text"
                placeholder="Tìm bệnh nhân..."
                value={patientSearchTerm}
                onChange={(e) => handlePatientSearch(e.target.value)}
                onFocus={() => setShowPatientDropdown(true)}
                onBlur={() => setTimeout(() => setShowPatientDropdown(false), 200)}
                className="patient-search-input"
              />
              {showPatientDropdown && filteredPatients.length > 0 && (
                <div className="patient-dropdown-list">
                  {filteredPatients.map((apt) => (
                    <div
                      key={apt.patientId}
                      className="patient-dropdown-item"
                      onClick={() => {
                        setPatientSearchTerm(`${apt.patient?.user?.firstName} ${apt.patient?.user?.lastName}`);
                        setShowPatientDropdown(false);
                      }}
                    >
                      <div className="patient-name">
                        {apt.patient?.user?.firstName} {apt.patient?.user?.lastName}
                      </div>
                      <div className="patient-mrn">
                        {apt.patient?.user?.phone}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="filter-bar">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Tất cả
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Chờ xác nhận
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('confirmed')}
            >
              Đã xác nhận
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Đã hoàn thành
            </button>
          </div>

          <div className="appointments-table">
            <table>
              <thead>
                <tr>
                  <th>Bệnh nhân</th>
                  <th>Ngày giờ khám</th>
                  <th>Chẩn đoán yêu cầu</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {displayedAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <strong>{apt.patient?.user?.firstName} {apt.patient?.user?.lastName}</strong>
                      <br/>
                      <small>{apt.patient?.user?.phone}</small>
                    </td>
                    <td>
                      {new Date(apt.appointmentDate).toLocaleString('vi-VN')}
                    </td>
                    <td>{apt.reason || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${apt.status}`}>
                        {apt.status === 'pending' && '⏳ Chờ xác nhận'}
                        {apt.status === 'confirmed' && '✓ Đã xác nhận'}
                        {apt.status === 'completed' && '✓ Đã hoàn thành'}
                        {apt.status === 'cancelled' && '✗ Đã hủy'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {apt.status === 'pending' && (
                          <>
                            <button 
                              className="btn-confirm"
                              onClick={() => updateStatus(apt.id, 'confirmed')}
                            >
                              Xác nhận
                            </button>
                            <button 
                              className="btn-cancel"
                              onClick={() => updateStatus(apt.id, 'cancelled')}
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button 
                            className="btn-complete"
                            onClick={() => updateStatus(apt.id, 'completed')}
                          >
                            Hoàn thành
                          </button>
                        )}
                        <button className="btn-view">Chi tiết</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAppointments.length === 0 && (
              <p className="no-data">Không có lịch khám</p>
            )}
          </div>

          <p className="total-count">Tổng: {filteredAppointments.length} lịch khám</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
