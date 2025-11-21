import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/doctor-prescriptions.css';

export default function DoctorPrescriptions() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    medicalRecordId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPatients();
    fetchPrescriptions();
  }, []);

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

  const fetchRecords = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/doctor/patients/${patientId}/records`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMedicalRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctor/prescriptions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    setFormData({ ...formData, patientId, medicalRecordId: '' });
    if (patientId) fetchRecords(patientId);
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
      const response = await fetch('http://localhost:5000/api/doctor/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Toa thuốc đã được tạo thành công');
        setFormData({
          patientId: '',
          medicalRecordId: '',
          medicationName: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: ''
        });
        fetchPrescriptions();
      } else {
        const error = await response.json();
        setMessage('Lỗi: ' + (error.message || 'Không thể tạo toa thuốc'));
      }
    } catch (error) {
      setMessage('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-prescriptions">
      <h1>Quản lý Toa thuốc</h1>

      <div className="prescriptions-container">
        <div className="prescription-form-section">
          <h2>Tạo Toa thuốc mới</h2>
          <form onSubmit={handleSubmit} className="prescription-form">
            <div className="form-group">
              <label>Bệnh nhân *</label>
              <select
                value={formData.patientId}
                onChange={handlePatientChange}
                required
                className="form-control"
              >
                <option value="">-- Chọn bệnh nhân --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.User?.firstName} {p.User?.lastName} - MRN: {p.medicalRecordNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Bệnh án *</label>
              <select
                name="medicalRecordId"
                value={formData.medicalRecordId}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">-- Chọn bệnh án --</option>
                {medicalRecords.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.diagnosis} - {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tên thuốc *</label>
              <input
                type="text"
                name="medicationName"
                value={formData.medicationName}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="VD: Amoxicillin"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Liều lượng *</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="VD: 500mg"
                />
              </div>
              <div className="form-group">
                <label>Tần suất *</label>
                <input
                  type="text"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="VD: 3 lần/ngày"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Thời gian sử dụng (ngày) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="VD: 7"
              />
            </div>

            <div className="form-group">
              <label>Hướng dẫn sử dụng</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
                placeholder="VD: Uống sau ăn, uống cùng nước"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Đang lưu...' : 'Tạo Toa thuốc'}
            </button>

            {message && <div className="message">{message}</div>}
          </form>
        </div>

        <div className="prescriptions-list-section">
          <h2>Danh sách Toa thuốc</h2>
          {prescriptions.length === 0 ? (
            <p className="no-data">Chưa có toa thuốc nào</p>
          ) : (
            <div className="prescriptions-list">
              {prescriptions.map(prescription => (
                <div key={prescription.id} className="prescription-card">
                  <div className="prescription-header">
                    <h3>{prescription.medicationName}</h3>
                    <span className="date">
                      {new Date(prescription.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="prescription-details">
                    <p><strong>Liều lượng:</strong> {prescription.dosage}</p>
                    <p><strong>Tần suất:</strong> {prescription.frequency}</p>
                    <p><strong>Thời gian:</strong> {prescription.duration} ngày</p>
                    <p><strong>Hướng dẫn:</strong> {prescription.instructions || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
