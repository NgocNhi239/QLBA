import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/doctor-medical-records.css';

const DoctorMedicalRecords = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [patient, setPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    diagnosis: '',
    primaryDiagnosis: '',
    treatment: '',
    notes: ''
  });

  useEffect(() => {
    if (patientId) {
      fetchRecords();
    }
  }, [patientId]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/medical-records/patient/${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRecords(data.data);
        // Set patient info from first record
        if (data.data.length > 0) {
          setPatient(data.data[0].patient);
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/medical-records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId,
          ...formData
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Tạo hồ sơ thành công!');
        setFormData({ diagnosis: '', primaryDiagnosis: '', treatment: '', notes: '' });
        setShowForm(false);
        fetchRecords();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Lỗi tạo hồ sơ');
      console.error(err);
    }
  };

  const handleEditRecord = (record) => {
    // TODO: Implement edit functionality
    alert('Chức năng chỉnh sửa đang phát triển');
  };

  const handleViewPrescriptions = (recordId) => {
    // Navigate to prescriptions page filtered by record
    navigate('/doctor/prescriptions', { state: { medicalRecordId: recordId, patientId } });
  };

  const handleViewLabTests = (recordId) => {
    // Navigate to lab tests page filtered by record
    navigate('/doctor/lab-tests', { state: { medicalRecordId: recordId, patientId } });
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="doctor-records-container">
          <h1>📋 Hồ sơ y tế bệnh nhân</h1>

          {error && <div className="error-message">{error}</div>}

          <button className="btn-create" onClick={() => setShowForm(!showForm)}>
            + Tạo hồ sơ mới
          </button>

          {showForm && (
            <div className="form-section">
              <h3>Tạo Hồ sơ y tế mới</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Chẩn đoán chính</label>
                  <input
                    type="text"
                    value={formData.primaryDiagnosis}
                    onChange={(e) => setFormData({...formData, primaryDiagnosis: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Chi tiết chẩn đoán</label>
                  <textarea
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Phương pháp điều trị</label>
                  <textarea
                    value={formData.treatment}
                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">Lưu</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Hủy</button>
                </div>
              </form>
            </div>
          )}

          <div className="records-list">
            {records.map((record) => (
              <div key={record.id} className="record-card">
                <div className="record-header">
                  <h4>Hồ sơ #{record.id}</h4>
                  <small>{new Date(record.createdAt).toLocaleDateString('vi-VN')}</small>
                </div>
                <div className="record-body">
                  <div className="record-field">
                    <strong>Chẩn đoán chính:</strong> {record.primaryDiagnosis || 'N/A'}
                  </div>
                  <div className="record-field">
                    <strong>Chi tiết:</strong> {record.diagnosis || 'Không có'}
                  </div>
                  <div className="record-field">
                    <strong>Điều trị:</strong> {record.treatment || 'Không có'}
                  </div>
                  <div className="record-field">
                    <strong>Ghi chú:</strong> {record.notes || 'Không có'}
                  </div>
                </div>
                <div className="record-actions">
                  <button className="btn-small" onClick={() => handleEditRecord(record)}>Chỉnh sửa</button>
                  <button className="btn-small" onClick={() => handleViewPrescriptions(record.id)}>Xem đơn thuốc</button>
                  <button className="btn-small" onClick={() => handleViewLabTests(record.id)}>Xem xét nghiệm</button>
                </div>
              </div>
            ))}
            {records.length === 0 && (
              <p className="no-data">Chưa có hồ sơ y tế</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorMedicalRecords;
