import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/doctor-benh-an.css';

const DoctorBenhAn = () => {
  const navigate = useNavigate();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [formData, setFormData] = useState({
    primaryDiagnosis: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    symptoms: '',
    examResult: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Get all patients (returns medical records with patient data)
      const patientsRes = await fetch('http://localhost:5000/api/doctor/patients-list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const patientsData = await patientsRes.json();
      if (patientsData.success) {
        // Extract unique patients from medical records
        const uniquePatients = [];
        const seenPatientIds = new Set();
        
        patientsData.data.forEach(medicalRecord => {
          if (medicalRecord.patientId && !seenPatientIds.has(medicalRecord.patientId)) {
            seenPatientIds.add(medicalRecord.patientId);
            uniquePatients.push({
              ...medicalRecord,
              patientForSelect: medicalRecord.patientId // Store the actual patient ID
            });
          }
        });
        
        setPatients(uniquePatients);
        if (uniquePatients.length > 0) {
          const firstPatientId = uniquePatients[0].patientId;
          setSelectedPatient(firstPatientId);
          fetchRecordsForPatient(firstPatientId, token);
        }
      }
    } catch (err) {
      setError('Lỗi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordsForPatient = async (patientId, token) => {
    try {
      const response = await fetch(`http://localhost:5000/api/doctor/patient-records/${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMedicalRecords(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePatientChange = async (patientId) => {
    setSelectedPatient(patientId);
    setPatientSearchTerm('');
    setShowPatientDropdown(false);
    setViewMode('list');
    setSelectedRecord(null);
    setMedicalRecords([]);
    const token = localStorage.getItem('token');
    if (patientId) {
      await fetchRecordsForPatient(patientId, token);
    }
  };

  const handlePatientSearch = (value) => {
    setPatientSearchTerm(value);
    setShowPatientDropdown(true);
    if (value) {
      setSelectedPatient('');
    }
  };

  const filteredPatients = patients.filter(p => {
    const firstName = p.patient?.user?.firstName?.toLowerCase() || '';
    const lastName = p.patient?.user?.lastName?.toLowerCase() || '';
    const mrn = p.patient?.medicalRecordNumber?.toLowerCase() || '';
    const search = patientSearchTerm.toLowerCase();
    
    return firstName.includes(search) || lastName.includes(search) || mrn.includes(search);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Vui lòng chọn bệnh nhân');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/medical-records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: selectedPatient,
          ...formData
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Tạo bệnh án thành công!');
        setFormData({ 
          primaryDiagnosis: '', 
          diagnosis: '', 
          treatment: '', 
          notes: '',
          symptoms: '',
          examResult: ''
        });
        setShowForm(false);
        handlePatientChange(selectedPatient);
      } else {
        alert(data.message || 'Lỗi tạo bệnh án');
      }
    } catch (err) {
      alert('Lỗi tạo bệnh án');
      console.error(err);
    }
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedRecord(null);
  };

  const filteredRecords = medicalRecords.filter(record =>
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.primaryDiagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Đang tải...</div>;

  const currentPatient = patients.find(p => p.patientId === selectedPatient);

  // Detail View
  if (viewMode === 'detail' && selectedRecord) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="benh-an-detail">
            <div className="detail-header">
              <button className="btn-back" onClick={handleBackToList}>← Quay lại</button>
              <h1>📋 Chi tiết Bệnh án</h1>
            </div>

            {/* Patient Info Card */}
            <div className="patient-card">
              <h3>Thông tin bệnh nhân</h3>
              <div className="patient-grid">
                <div className="info-box">
                  <label>Họ tên</label>
                  <value>{currentPatient?.patient?.user?.firstName} {currentPatient?.patient?.user?.lastName}</value>
                </div>
                <div className="info-box">
                  <label>Mã hồ sơ</label>
                  <value>{currentPatient?.patient?.medicalRecordNumber}</value>
                </div>
                <div className="info-box">
                  <label>Ngày sinh</label>
                  <value>{new Date(currentPatient?.patient?.dateOfBirth).toLocaleDateString('vi-VN')}</value>
                </div>
                <div className="info-box">
                  <label>Nhóm máu</label>
                  <value>{currentPatient?.patient?.bloodType || 'N/A'}</value>
                </div>
                <div className="info-box">
                  <label>Dị ứng</label>
                  <value>{currentPatient?.patient?.allergies || 'Không có'}</value>
                </div>
                <div className="info-box">
                  <label>Địa chỉ</label>
                  <value>{currentPatient?.patient?.address || 'N/A'}</value>
                </div>
              </div>
            </div>

            {/* Medical Record Detail */}
            <div className="record-detail-card">
              <h3>Bệnh án #{selectedRecord.id}</h3>
              <div className="record-meta">
                <span>Ngày khám: {new Date(selectedRecord.visitDate || selectedRecord.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>

              <div className="section">
                <h4>📝 Triệu chứng lâm sàng</h4>
                <p>{selectedRecord.symptoms || selectedRecord.diagnosis || 'N/A'}</p>
              </div>

              <div className="section">
                <h4>🔍 Kết quả khám lâm sàng</h4>
                <p>{selectedRecord.examResult || selectedRecord.treatment || 'N/A'}</p>
              </div>

              <div className="section">
                <h4>🏥 Chẩn đoán</h4>
                <div className="diagnosis-box">
                  <strong>Chẩn đoán chính:</strong> {selectedRecord.primaryDiagnosis}
                  <br/>
                  {selectedRecord.diagnosis && (
                    <>
                      <strong>Chi tiết:</strong> {selectedRecord.diagnosis}
                    </>
                  )}
                </div>
              </div>

              <div className="section">
                <h4>💊 Phương pháp điều trị</h4>
                <p>{selectedRecord.treatment || 'Chưa có thông tin'}</p>
              </div>

              {selectedRecord.notes && (
                <div className="section">
                  <h4>📌 Ghi chú</h4>
                  <p>{selectedRecord.notes}</p>
                </div>
              )}

              {/* Related Prescriptions & Lab Tests */}
              <div className="related-section">
                <div className="related-box">
                  <h4>💊 Toa thuốc liên quan</h4>
                  {selectedRecord.prescriptions?.length > 0 ? (
                    <ul>
                      {selectedRecord.prescriptions.map(rx => (
                        <li key={rx.id}>{rx.medicationName} - {rx.dosage}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Chưa có toa thuốc</p>
                  )}
                  <button className="btn-add" onClick={() => navigate('/doctor/prescriptions')}>
                    + Kê đơn mới
                  </button>
                </div>

                <div className="related-box">
                  <h4>🧪 Xét nghiệm liên quan</h4>
                  {selectedRecord.labTests?.length > 0 ? (
                    <ul>
                      {selectedRecord.labTests.map(test => (
                        <li key={test.id}>{test.testName}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Chưa có xét nghiệm</p>
                  )}
                  <button className="btn-add" onClick={() => navigate('/doctor/lab-tests')}>
                    + Chỉ định xét nghiệm
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-edit">✏️ Chỉnh sửa</button>
                <button className="btn-print">🖨️ In bệnh án</button>
                <button className="btn-back" onClick={handleBackToList}>Quay lại</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="benh-an-container">
          <h1>📋 Quản lý Bệnh án điện tử</h1>

          {error && <div className="error-message">{error}</div>}

          {/* Patient Selector */}
          <div className="patient-selector">
            <label>Chọn Bệnh nhân:</label>
            <div className="searchable-patient-selector">
              <input
                type="text"
                placeholder="Tìm bệnh nhân (tên hoặc mã hồ sơ)..."
                value={patientSearchTerm || (currentPatient ? `${currentPatient.patient?.user?.firstName} ${currentPatient.patient?.user?.lastName}` : '')}
                onChange={(e) => handlePatientSearch(e.target.value)}
                onFocus={() => setShowPatientDropdown(true)}
                className="patient-search-input"
              />
              {showPatientDropdown && (filteredPatients.length > 0) && (
                <div className="patient-dropdown-list">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.patientId}
                      className="patient-dropdown-item"
                      onClick={() => handlePatientChange(patient.patientId)}
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

          {currentPatient && (
            <div className="patient-info">
              <div className="info-item">
                <strong>Họ tên:</strong> {currentPatient.patient?.user?.firstName} {currentPatient.patient?.user?.lastName}
              </div>
              <div className="info-item">
                <strong>Mã hồ sơ:</strong> {currentPatient.patient?.medicalRecordNumber}
              </div>
              <div className="info-item">
                <strong>Ngày sinh:</strong> {new Date(currentPatient.patient?.dateOfBirth).toLocaleDateString('vi-VN')}
              </div>
              <div className="info-item">
                <strong>Nhóm máu:</strong> {currentPatient.patient?.bloodType || 'N/A'}
              </div>
            </div>
          )}

          <div className="benh-an-controls">
            <button className="btn-create" onClick={() => setShowForm(!showForm)}>
              + Tạo bệnh án mới
            </button>
            <input
              type="text"
              placeholder="Tìm kiếm chẩn đoán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {showForm && (
            <div className="form-section">
              <h3>Tạo Bệnh án mới</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Triệu chứng lâm sàng</label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    rows="3"
                    placeholder="Mô tả triệu chứng bệnh nhân"
                  />
                </div>

                <div className="form-group">
                  <label>Kết quả khám lâm sàng</label>
                  <textarea
                    value={formData.examResult}
                    onChange={(e) => setFormData({...formData, examResult: e.target.value})}
                    rows="3"
                    placeholder="Kết quả khám lâm sàng"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Chẩn đoán chính *</label>
                    <input
                      type="text"
                      value={formData.primaryDiagnosis}
                      onChange={(e) => setFormData({...formData, primaryDiagnosis: e.target.value})}
                      placeholder="Ví dụ: Cảm cúm, Viêm phổi"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Chẩn đoán phụ</label>
                    <input
                      type="text"
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      placeholder="(nếu có)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phương pháp điều trị</label>
                  <textarea
                    value={formData.treatment}
                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                    rows="4"
                    placeholder="Mô tả phương pháp điều trị"
                  />
                </div>

                <div className="form-group">
                  <label>Ghi chú thêm</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    placeholder="Các ghi chú khác"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save">Lưu</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Hủy</button>
                </div>
              </form>
            </div>
          )}

          {/* Medical Records List */}
          <div className="records-section">
            <h3>Danh sách bệnh án ({filteredRecords.length})</h3>
            
            {filteredRecords.length === 0 ? (
              <div className="no-data">
                {selectedPatient ? 'Chưa có bệnh án cho bệnh nhân này' : 'Vui lòng chọn bệnh nhân'}
              </div>
            ) : (
              <div className="records-list">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="record-item">
                    <div className="record-left">
                      <h4>Bệnh án #{record.id}</h4>
                      <div className="record-info">
                        <span className="date">📅 {new Date(record.visitDate || record.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span className="diagnosis">🏥 {record.primaryDiagnosis}</span>
                      </div>
                      {record.diagnosis && (
                        <p className="sub-diagnosis">Chi tiết: {record.diagnosis.substring(0, 80)}...</p>
                      )}
                    </div>
                    <div className="record-right">
                      <button 
                        className="btn-view-detail"
                        onClick={() => handleViewDetail(record)}
                      >
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorBenhAn;
