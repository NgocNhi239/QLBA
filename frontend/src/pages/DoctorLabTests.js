import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/doctor-lab-tests.css';

const DoctorLabTests = () => {
  const location = useLocation();
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [filterRecordId, setFilterRecordId] = useState(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [formData, setFormData] = useState({
    testName: '',
    description: ''
  });
  const [resultData, setResultData] = useState({
    status: 'completed',
    resultValue: '',
    notes: ''
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

      // Fetch medical records
      const recordsRes = await fetch('http://localhost:5000/api/medical-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const recordsData = await recordsRes.json();
      if (recordsData.success) {
        setPatients(recordsData.data);
      }

      // Fetch lab tests
      const testsRes = await fetch('http://localhost:5000/api/lab-tests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const testsData = await testsRes.json();
      if (testsData.success) {
        setLabTests(testsData.data || []);
      }
    } catch (err) {
      setError('Lỗi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientChange = (recordId) => {
    setSelectedRecord(recordId);
    setPatientSearchTerm('');
    setShowPatientDropdown(false);
  };

  const handlePatientSearch = (value) => {
    setPatientSearchTerm(value);
    setShowPatientDropdown(true);
    if (value) {
      setSelectedRecord('');
    }
  };

  const filteredPatients = patients.filter(p => {
    const firstName = p.patient?.user?.firstName?.toLowerCase() || '';
    const lastName = p.patient?.user?.lastName?.toLowerCase() || '';
    const mrn = p.patient?.medicalRecordNumber?.toLowerCase() || '';
    const search = patientSearchTerm.toLowerCase();
    
    return firstName.includes(search) || lastName.includes(search) || mrn.includes(search);
  });

  const filteredLabTests = selectedRecord 
    ? labTests.filter(test => test.medicalRecordId === selectedRecord)
    : labTests;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRecord) {
      alert('Vui lòng chọn hồ sơ y tế');
      return;
    }

    try {
      const record = patients.find(p => p.id === selectedRecord);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/lab-tests', {
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
        alert('Đặt xét nghiệm thành công!');
        setFormData({ testName: '', description: '' });
        setSelectedRecord('');
        setShowForm(false);
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Lỗi đặt xét nghiệm');
      console.error(err);
    }
  };

  const handleStatusUpdate = async (testId, newStatus, resultValue = '', notes = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/lab-tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          resultValue: resultValue,
          notes: notes
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Cập nhật trạng thái thành công!');
        setShowResultModal(false);
        setSelectedTest(null);
        setResultData({ status: 'completed', resultValue: '', notes: '' });
        fetchData();
      } else {
        alert(data.message || 'Lỗi cập nhật');
      }
    } catch (err) {
      alert('Lỗi cập nhật trạng thái');
      console.error(err);
    }
  };

  const openResultModal = (test) => {
    setSelectedTest(test);
    setResultData({
      status: 'completed',
      resultValue: '',
      notes: ''
    });
    setShowResultModal(true);
  };

  const handleResultSubmit = () => {
    if (!selectedTest) return;
    handleStatusUpdate(selectedTest.id, resultData.status, resultData.resultValue, resultData.notes);
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="lab-tests-container">
          <h1>🧪 Quản lý Xét nghiệm</h1>

          {error && <div className="error-message">{error}</div>}

          <button className="btn-create" onClick={() => setShowForm(!showForm)}>
            + Đặt xét nghiệm mới
          </button>

          {showForm && (
            <div className="form-section">
              <h3>Đặt Xét nghiệm mới</h3>
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
                            onClick={() => handlePatientChange(patient.id)}
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
                  <label>Loại xét nghiệm</label>
                  <input
                    type="text"
                    value={formData.testName}
                    onChange={(e) => setFormData({...formData, testName: e.target.value})}
                    placeholder="Ví dụ: Xét nghiệm máu, Siêu âm, X-quang"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Chi tiết/Chỉ định</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    placeholder="Mô tả chi tiết lý do yêu cầu xét nghiệm"
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
                        onClick={() => handlePatientChange(patient.id)}
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

          <div className="tests-list">
            <h3>Danh sách xét nghiệm ({filteredLabTests.length})</h3>
            {filteredLabTests.length === 0 ? (
              <p className="info-text">Chưa có xét nghiệm nào</p>
            ) : (
              <table className="tests-table">
                <thead>
                  <tr>
                    <th>Loại xét nghiệm</th>
                    <th>Ngày yêu cầu</th>
                    <th>Trạng thái</th>
                    <th>Kết quả</th>
                    <th>Ghi chú</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabTests.map((test) => (
                    <tr key={test.id}>
                      <td>{test.testName}</td>
                      <td>{new Date(test.orderedDate || test.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <span className={`status-badge status-${test.status}`}>
                          {test.status === 'pending' ? '⏳ Chờ xử lý' : 
                           test.status === 'completed' ? '✅ Hoàn thành' : 
                           test.status === 'abnormal' ? '⚠️ Bất thường' : test.status}
                        </span>
                      </td>
                      <td>{test.resultValue || '-'}</td>
                      <td>{test.notes || '-'}</td>
                      <td>
                        {test.status === 'pending' && (
                          <button 
                            className="btn-update-status"
                            onClick={() => openResultModal(test)}
                          >
                            Cập nhật kết quả
                          </button>
                        )}
                        {test.status !== 'pending' && (
                          <span className="completed-text">Đã xử lý</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && selectedTest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nhập Kết quả Xét nghiệm</h3>
              <button className="modal-close" onClick={() => setShowResultModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="info-section">
                <p><strong>Loại xét nghiệm:</strong> {selectedTest.testName}</p>
                <p><strong>Ngày yêu cầu:</strong> {new Date(selectedTest.orderedDate || selectedTest.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>

              <div className="form-group">
                <label>Trạng thái *</label>
                <select
                  value={resultData.status}
                  onChange={(e) => setResultData({...resultData, status: e.target.value})}
                  className="form-control"
                >
                  <option value="completed">✅ Hoàn thành</option>
                  <option value="abnormal">⚠️ Bất thường</option>
                </select>
              </div>

              <div className="form-group">
                <label>Kết quả</label>
                <input
                  type="text"
                  value={resultData.resultValue}
                  onChange={(e) => setResultData({...resultData, resultValue: e.target.value})}
                  placeholder="Ví dụ: 120 mg/dL, Âm tính, Bình thường"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={resultData.notes}
                  onChange={(e) => setResultData({...resultData, notes: e.target.value})}
                  placeholder="Ghi chú thêm về kết quả"
                  rows="3"
                  className="form-control"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-save" onClick={handleResultSubmit}>Lưu kết quả</button>
              <button className="btn-cancel" onClick={() => setShowResultModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorLabTests;
