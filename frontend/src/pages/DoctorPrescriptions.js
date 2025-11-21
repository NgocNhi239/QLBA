import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/doctor-prescriptions.css';

const DoctorPrescriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState('');
  const [filterRecordId, setFilterRecordId] = useState(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    // Get filter from location state if coming from DoctorMedicalRecords
    if (location.state?.medicalRecordId) {
      setFilterRecordId(location.state.medicalRecordId);
    }
    fetchData();
  }, [location.state?.medicalRecordId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Get patients
      const patientsRes = await fetch('http://localhost:5000/api/medical-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const patientsData = await patientsRes.json();
      if (patientsData.success) {
        setPatients(patientsData.data);
      }

      // Get prescriptions
      const presRes = await fetch('http://localhost:5000/api/prescriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const presData = await presRes.json();
      if (presData.success) {
        setPrescriptions(presData.data || []);
      }
    } catch (err) {
      setError('Lỗi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecord = async (recordId) => {
    setSelectedRecord(recordId);
    setPatientSearchTerm('');
    setShowPatientDropdown(false);
    const record = patients.find(p => p.id === recordId);
    if (record) {
      setMedicalRecords([record]);
    }
  };

  const handlePatientSearch = (value) => {
    setPatientSearchTerm(value);
    setShowPatientDropdown(true);
  };

  const filteredPatients = patients.filter((patient) => {
    if (!patientSearchTerm) return true;
    const searchLower = patientSearchTerm.toLowerCase();
    const fullName = `${patient.patient?.user?.firstName || ''} ${patient.patient?.user?.lastName || ''}`.toLowerCase();
    const recordNumber = patient.patient?.medicalRecordNumber?.toLowerCase() || '';
    return fullName.includes(searchLower) || recordNumber.includes(searchLower);
  });

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    if (!selectedRecord) return true;
    return prescription.medicalRecordId === selectedRecord;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRecord) {
      alert('Vui lòng chọn hồ sơ y tế');
      return;
    }

    try {
      const record = patients.find(p => p.id === selectedRecord);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/prescriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          medicalRecordId: selectedRecord,
          patientId: record.patientId,
          ...formData
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Tạo đơn thuốc thành công!');
        setFormData({ medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' });
        setSelectedRecord('');
        setShowForm(false);
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Lỗi tạo đơn thuốc');
      console.error(err);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="prescriptions-container">
          <h1>💊 Quản lý Toa thuốc</h1>

          {error && <div className="error-message">{error}</div>}

          <button className="btn-create" onClick={() => setShowForm(!showForm)}>
            + Tạo đơn thuốc mới
          </button>

          {showForm && (
            <div className="form-section">
              <h3>Tạo Đơn thuốc mới</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Chọn Hồ sơ y tế</label>
                  <div className="searchable-selector">
                    <input
                      type="text"
                      placeholder="Tìm hồ sơ (tên hoặc mã)..."
                      value={patientSearchTerm || (selectedRecord && patients.find(p => p.id === selectedRecord) ? `${patients.find(p => p.id === selectedRecord).patient?.user?.firstName} ${patients.find(p => p.id === selectedRecord).patient?.user?.lastName}` : '')}
                      onChange={(e) => handlePatientSearch(e.target.value)}
                      onFocus={() => setShowPatientDropdown(true)}
                      className="selector-input"
                    />
                    {showPatientDropdown && filteredPatients.length > 0 && (
                      <div className="dropdown-list">
                        {filteredPatients.map((patient) => (
                          <div
                            key={patient.id}
                            className="dropdown-item"
                            onClick={() => handleSelectRecord(patient.id)}
                          >
                            <div>{patient.patient?.user?.firstName} {patient.patient?.user?.lastName}</div>
                            <small>{patient.patient?.medicalRecordNumber}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Tên thuốc</label>
                  <input
                    type="text"
                    value={formData.medicationName}
                    onChange={(e) => setFormData({...formData, medicationName: e.target.value})}
                    placeholder="Ví dụ: Paracetamol"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Liều lượng</label>
                    <input
                      type="text"
                      value={formData.dosage}
                      onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                      placeholder="Ví dụ: 500mg"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tần suất</label>
                    <input
                      type="text"
                      value={formData.frequency}
                      onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                      placeholder="Ví dụ: 3 lần/ngày"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Thời hạn</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="Ví dụ: 7 ngày"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hướng dẫn sử dụng</label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    rows="3"
                    placeholder="Hướng dẫn sử dụng và chú ý"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">Lưu</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Hủy</button>
                </div>
              </form>
            </div>
          )}

          {/* Patient Filter - Searchable Selector */}
          {patients.length > 0 && (
            <div className="patient-filter">
              <label>Lọc theo hồ sơ:</label>
              <div className="searchable-patient-selector" style={{flex: 1}}>
                <input
                  type="text"
                  placeholder="Tìm hồ sơ (tên hoặc mã)..."
                  value={patientSearchTerm || (selectedRecord && patients.find(p => p.id === selectedRecord) ? `${patients.find(p => p.id === selectedRecord).patient?.user?.firstName} ${patients.find(p => p.id === selectedRecord).patient?.user?.lastName}` : '')}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                  onFocus={() => setShowPatientDropdown(true)}
                  className="patient-search-input"
                />
                {showPatientDropdown && filteredPatients.length > 0 && (
                  <div className="patient-dropdown-list">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="patient-dropdown-item"
                        onClick={() => handleSelectRecord(patient.id)}
                      >
                        <div className="patient-name">
                          {patient.patient?.user?.firstName} {patient.patient?.user?.lastName}
                        </div>
                        <div className="patient-mrn">
                          {patient.patient?.medicalRecordNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="prescriptions-list">
            <h3>Danh sách toa thuốc ({filteredPrescriptions.length})</h3>
            {filteredPrescriptions.length === 0 ? (
              <p className="info-text">Chưa có toa thuốc nào</p>
            ) : (
              <table className="prescriptions-table">
                <thead>
                  <tr>
                    <th>Tên thuốc</th>
                    <th>Liều lượng</th>
                    <th>Tần suất</th>
                    <th>Thời hạn</th>
                    <th>Trạng thái</th>
                    <th>Hướng dẫn</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td>{prescription.medicationName}</td>
                      <td>{prescription.dosage}</td>
                      <td>{prescription.frequency}</td>
                      <td>{prescription.duration}</td>
                      <td>
                        <span className={`status-badge status-${prescription.status}`}>
                          {prescription.status === 'active' ? '✅ Còn hiệu lực' : 
                           prescription.status === 'expired' ? '❌ Hết hiệu lực' : prescription.status}
                        </span>
                      </td>
                      <td>{prescription.instructions || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
