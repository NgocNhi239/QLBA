import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/doctor-lab-tests.css';

export default function DoctorLabTests() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    medicalRecordId: '',
    testName: '',
    testType: 'blood',
    description: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const testTypes = [
    { value: 'blood', label: 'Xét nghiệm máu' },
    { value: 'urine', label: 'Xét nghiệm nước tiểu' },
    { value: 'imaging', label: 'Chụp ảnh' },
    { value: 'ecg', label: 'Điện tâm đồ (ECG)' },
    { value: 'ultrasound', label: 'Siêu âm' },
    { value: 'xray', label: 'Chụp X-quang' },
    { value: 'other', label: 'Khác' }
  ];

  useEffect(() => {
    fetchPatients();
    fetchLabTests();
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

  const fetchLabTests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctor/lab-tests', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLabTests(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching lab tests:', error);
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
      const response = await fetch('http://localhost:5000/api/doctor/lab-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Đơn xét nghiệm đã được tạo thành công');
        setFormData({
          patientId: '',
          medicalRecordId: '',
          testName: '',
          testType: 'blood',
          description: '',
          notes: ''
        });
        fetchLabTests();
      } else {
        const error = await response.json();
        setMessage('Lỗi: ' + (error.message || 'Không thể tạo đơn xét nghiệm'));
      }
    } catch (error) {
      setMessage('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLabTests = labTests.filter(test => {
    if (filter === 'all') return true;
    return test.status === filter;
  });

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Chờ xử lý';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getTestTypeName = (type) => {
    const found = testTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="doctor-lab-tests">
      <h1>Quản lý Xét nghiệm</h1>

      <div className="lab-tests-container">
        <div className="lab-test-form-section">
          <h2>Tạo Đơn xét nghiệm mới</h2>
          <form onSubmit={handleSubmit} className="lab-test-form">
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
              <label>Loại xét nghiệm *</label>
              <select
                name="testType"
                value={formData.testType}
                onChange={handleInputChange}
                className="form-control"
              >
                {testTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tên xét nghiệm *</label>
              <input
                type="text"
                name="testName"
                value={formData.testName}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="VD: CBC, Glucose, ..."
              />
            </div>

            <div className="form-group">
              <label>Mô tả chi tiết</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control"
                rows="2"
                placeholder="Mô tả chi tiết về xét nghiệm"
              />
            </div>

            <div className="form-group">
              <label>Ghi chú</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-control"
                rows="2"
                placeholder="Ghi chú thêm cho phòng xét nghiệm"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Đang tạo...' : 'Tạo Đơn xét nghiệm'}
            </button>

            {message && <div className="message">{message}</div>}
          </form>
        </div>

        <div className="lab-tests-list-section">
          <h2>Danh sách Xét nghiệm</h2>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tất cả ({labTests.length})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Chờ xử lý ({labTests.filter(t => t.status === 'pending').length})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Hoàn thành ({labTests.filter(t => t.status === 'completed').length})
            </button>
          </div>

          {filteredLabTests.length === 0 ? (
            <p className="no-data">Chưa có xét nghiệm nào</p>
          ) : (
            <div className="lab-tests-table">
              <table>
                <thead>
                  <tr>
                    <th>Bệnh nhân</th>
                    <th>Loại xét nghiệm</th>
                    <th>Tên xét nghiệm</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabTests.map(test => (
                    <tr key={test.id}>
                      <td>{test.Patient?.User?.firstName} {test.Patient?.User?.lastName}</td>
                      <td>{getTestTypeName(test.testType)}</td>
                      <td>{test.testName}</td>
                      <td>{new Date(test.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <span className={`status ${getStatusClass(test.status)}`}>
                          {getStatusText(test.status)}
                        </span>
                      </td>
                      <td className="details">{test.description || 'N/A'}</td>
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
