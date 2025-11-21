import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/patient-dashboard.css';

const PatientHealthRecords = () => {
  const { user } = useContext(AuthContext);
  const [patientInfo, setPatientInfo] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Get patient profile
      const patientRes = await fetch(`http://localhost:5000/api/patients/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const patientData = await patientRes.json();
      if (patientData.success) {
        setPatientInfo(patientData.data);

        // Get all related data
        const patientId = patientData.data.id;

        const [recordsRes, presRes, labRes, appointRes] = await Promise.all([
          fetch(`http://localhost:5000/api/medical-records/patient/${patientId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/prescriptions/patient/${patientId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/lab-tests/patient/${patientId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/appointments/patient/${patientId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const [recordsData, presData, labData, appointData] = await Promise.all([
          recordsRes.json(),
          presRes.json(),
          labRes.json(),
          appointRes.json()
        ]);

        if (recordsData.success) setMedicalHistory(recordsData.data || []);
        if (presData.success) setPrescriptions(presData.data || []);
        if (labData.success) setLabTests(labData.data || []);
        if (appointData.success) setAppointments(appointData.data || []);
      }
    } catch (err) {
      setError('Lỗi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  const pendingAppts = appointments.filter(a => a.status === 'pending');
  const completedRecords = medicalHistory.length;
  const activePrescriptions = prescriptions.filter(p => p.status === 'active').length;
  const pendingTests = labTests.filter(t => t.status === 'pending').length;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="patient-dashboard-content">
          <h2>❤️ Hồ sơ sức khỏe của tôi</h2>

          {error && <div className="error-message">{error}</div>}

          {/* Health Summary Cards */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            <div style={{padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196F3'}}>
              <h4 style={{margin: 0, color: '#1976D2'}}>📋 Bệnh án</h4>
              <p style={{margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold'}}>{completedRecords}</p>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#666'}}>Hoàn thành</p>
            </div>
            <div style={{padding: '1rem', backgroundColor: '#f3e5f5', borderRadius: '8px', borderLeft: '4px solid #9C27B0'}}>
              <h4 style={{margin: 0, color: '#7B1FA2'}}>💊 Toa thuốc</h4>
              <p style={{margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold'}}>{activePrescriptions}</p>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#666'}}>Còn hiệu lực</p>
            </div>
            <div style={{padding: '1rem', backgroundColor: '#f0f4c3', borderRadius: '8px', borderLeft: '4px solid #FBC02D'}}>
              <h4 style={{margin: 0, color: '#F57F17'}}>🧪 Xét nghiệm</h4>
              <p style={{margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold'}}>{pendingTests}</p>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#666'}}>Chờ xử lý</p>
            </div>
            <div style={{padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4CAF50'}}>
              <h4 style={{margin: 0, color: '#2E7D32'}}>📅 Lịch khám</h4>
              <p style={{margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold'}}>{pendingAppts}</p>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#666'}}>Chờ xác nhận</p>
            </div>
          </div>

          {/* Patient Info */}
          {patientInfo && (
            <div className="patient-section" style={{marginBottom: '2rem'}}>
              <h3>Thông tin cơ bản</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
                <div>
                  <strong>Mã bệnh nhân:</strong> {patientInfo.medicalRecordNumber}
                </div>
                <div>
                  <strong>Nhóm máu:</strong> {patientInfo.bloodType || 'N/A'}
                </div>
                <div>
                  <strong>Giới tính:</strong> {patientInfo.gender === 'male' ? 'Nam' : patientInfo.gender === 'female' ? 'Nữ' : 'N/A'}
                </div>
                <div>
                  <strong>Ngày sinh:</strong> {new Date(patientInfo.dateOfBirth).toLocaleDateString('vi-VN')}
                </div>
                {patientInfo.allergies && (
                  <div style={{gridColumn: '1 / -1'}}>
                    <strong>Dị ứng:</strong> {patientInfo.allergies}
                  </div>
                )}
                {patientInfo.medicalHistory && (
                  <div style={{gridColumn: '1 / -1'}}>
                    <strong>Lịch sử bệnh:</strong> {patientInfo.medicalHistory}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem'}}>
            <div className="patient-section">
              <h3>Bệnh án gần đây ({medicalHistory.length})</h3>
              {medicalHistory.length === 0 ? (
                <p className="no-data">Chưa có bệnh án</p>
              ) : (
                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                  {medicalHistory.slice(0, 3).map(record => (
                    <div key={record.id} style={{padding: '0.5rem 0', borderBottom: '1px solid #eee', fontSize: '0.9rem'}}>
                      <div><strong>{new Date(record.visitDate || record.createdAt).toLocaleDateString('vi-VN')}</strong></div>
                      <div>🏥 {record.primaryDiagnosis}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="patient-section">
              <h3>Xét nghiệm gần đây ({labTests.length})</h3>
              {labTests.length === 0 ? (
                <p className="no-data">Chưa có xét nghiệm</p>
              ) : (
                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                  {labTests.slice(0, 3).map(test => (
                    <div key={test.id} style={{padding: '0.5rem 0', borderBottom: '1px solid #eee', fontSize: '0.9rem'}}>
                      <div><strong>{test.testName}</strong></div>
                      <div>
                        <span className={`test-status ${test.status?.toLowerCase()}`} style={{fontSize: '0.8rem'}}>
                          {test.status === 'pending' ? '⏳ Chờ xử lý' : 
                           test.status === 'completed' ? '✅ Hoàn thành' : test.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHealthRecords;
