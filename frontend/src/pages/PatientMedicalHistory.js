import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/patient-dashboard.css';

const PatientMedicalHistory = () => {
  const { user } = useContext(AuthContext);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

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

        // Get medical records
        const recordsRes = await fetch(`http://localhost:5000/api/medical-records/patient/${patientData.data.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const recordsData = await recordsRes.json();
        if (recordsData.success) {
          setMedicalHistory(recordsData.data || []);
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
          <h2>📋 Lịch sử khám bệnh</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="patient-section">
            {medicalHistory.length === 0 ? (
              <p className="no-data">Chưa có lịch sử khám bệnh</p>
            ) : (
              <div className="history-list">
                {medicalHistory.map(record => (
                  <div 
                    key={record.id} 
                    className="history-item"
                  >
                    <div className="history-left">
                      <div className="history-date">
                        📅 {new Date(record.visitDate || record.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="history-doctor">
                        👨‍⚕️ Dr. {record.doctor?.firstName} {record.doctor?.lastName}
                      </div>
                    </div>
                    <div className="history-middle">
                      <div className="history-diagnosis">
                        <strong>Chẩn đoán:</strong> {record.primaryDiagnosis}
                      </div>
                      {record.diagnosis && (
                        <div className="history-note">Chi tiết: {record.diagnosis}</div>
                      )}
                    </div>
                    <div className="history-right">
                      <button 
                        className="btn-view" 
                        onClick={() => setSelectedRecord(record)}
                        style={{padding: '0.5rem 1rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Record Detail Modal */}
          {selectedRecord && (
            <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
              <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <h3>Chi tiết Bệnh án</h3>
                  <button onClick={() => setSelectedRecord(null)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>✕</button>
                </div>
                <div style={{lineHeight: '1.8'}}>
                  <p><strong>📅 Ngày khám:</strong> {new Date(selectedRecord.visitDate || selectedRecord.createdAt).toLocaleDateString('vi-VN')}</p>
                  <p><strong>👨‍⚕️ Bác sĩ:</strong> {selectedRecord.doctor?.firstName} {selectedRecord.doctor?.lastName}</p>
                  <hr />
                  <p><strong>🏥 Chẩn đoán chính:</strong> {selectedRecord.primaryDiagnosis}</p>
                  {selectedRecord.diagnosis && <p><strong>Chi tiết:</strong> {selectedRecord.diagnosis}</p>}
                  {selectedRecord.symptoms && <p><strong>Triệu chứng:</strong> {selectedRecord.symptoms}</p>}
                  {selectedRecord.examResult && <p><strong>Kết quả khám:</strong> {selectedRecord.examResult}</p>}
                  {selectedRecord.treatment && <p><strong>Điều trị:</strong> {selectedRecord.treatment}</p>}
                  {selectedRecord.notes && <p><strong>Ghi chú:</strong> {selectedRecord.notes}</p>}
                </div>
                <button onClick={() => setSelectedRecord(null)} style={{marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Đóng</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
