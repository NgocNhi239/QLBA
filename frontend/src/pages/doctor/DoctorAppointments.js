import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/doctor-appointments.css';

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctor/appointments', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctor/patients', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/doctor/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          appointmentDateTime: `${formData.appointmentDate}T${formData.appointmentTime}`
        })
      });

      if (response.ok) {
        setMessage('Lịch khám đã được tạo thành công');
        setFormData({
          patientId: '',
          appointmentDate: '',
          appointmentTime: '',
          reason: ''
        });
        fetchAppointments();
      } else {
        const error = await response.json();
        setMessage('Lỗi: ' + (error.message || 'Không thể tạo lịch khám'));
      }
    } catch (error) {
      setMessage('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/doctor/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchAppointments();
        setMessage('Cập nhật trạng thái thành công');
      }
    } catch (error) {
      setMessage('Lỗi cập nhật: ' + error.message);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusClass = (status) => {
    switch(status) {
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'scheduled': return 'Đã đặt lịch';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="doctor-appointments">
      <h1>Quản lý Lịch khám</h1>

      <div className="appointments-container">
        <div className="appointment-form-section">
          <h2>Tạo Lịch khám mới</h2>
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label>Bệnh nhân *</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">-- Chọn bệnh nhân --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.User?.firstName} {p.User?.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày khám *</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Giờ khám *</label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Lý do khám *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                className="form-control"
                rows="3"
                placeholder="VD: Tái khám, Kiểm tra định kỳ, ..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Đang tạo...' : 'Tạo Lịch khám'}
            </button>

            {message && <div className="message">{message}</div>}
          </form>
        </div>

        <div className="appointments-list-section">
          <h2>Danh sách Lịch khám</h2>
          
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tất cả ({appointments.length})
            </button>
            <button
              className={`filter-btn ${filter === 'scheduled' ? 'active' : ''}`}
              onClick={() => setFilter('scheduled')}
            >
              Đã đặt lịch ({appointments.filter(a => a.status === 'scheduled').length})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Đã hoàn thành ({appointments.filter(a => a.status === 'completed').length})
            </button>
            <button
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Đã hủy ({appointments.filter(a => a.status === 'cancelled').length})
            </button>
          </div>

          {filteredAppointments.length === 0 ? (
            <p className="no-data">Chưa có lịch khám nào</p>
          ) : (
            <div className="appointments-table">
              <table>
                <thead>
                  <tr>
                    <th>Bệnh nhân</th>
                    <th>Ngày khám</th>
                    <th>Giờ khám</th>
                    <th>Lý do</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(apt => (
                    <tr key={apt.id}>
                      <td>{apt.Patient?.User?.firstName} {apt.Patient?.User?.lastName}</td>
                      <td>{new Date(apt.appointmentDateTime).toLocaleDateString('vi-VN')}</td>
                      <td>{new Date(apt.appointmentDateTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{apt.reason}</td>
                      <td>
                        <span className={`status ${getStatusClass(apt.status)}`}>
                          {getStatusText(apt.status)}
                        </span>
                      </td>
                      <td className="actions">
                        {apt.status === 'scheduled' && (
                          <>
                            <button
                              className="btn-small btn-success"
                              onClick={() => updateStatus(apt.id, 'completed')}
                              title="Đánh dấu đã hoàn thành"
                            >
                              ✓
                            </button>
                            <button
                              className="btn-small btn-danger"
                              onClick={() => updateStatus(apt.id, 'cancelled')}
                              title="Hủy lịch khám"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
