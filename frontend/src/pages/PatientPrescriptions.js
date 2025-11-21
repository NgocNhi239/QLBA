import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/patient-dashboard.css';

const PatientPrescriptions = () => {
  const { user } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Get patient profile first
      const patientRes = await fetch(`http://localhost:5000/api/patients/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const patientData = await patientRes.json();
      if (patientData.success) {
        // Get prescriptions
        const presRes = await fetch(`http://localhost:5000/api/prescriptions/patient/${patientData.data.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const presData = await presRes.json();
        if (presData.success) {
          setPrescriptions(presData.data || []);
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
          <h2>💊 Toa thuốc của tôi</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="patient-section">
            {prescriptions.length === 0 ? (
              <p className="no-data">Chưa có toa thuốc nào</p>
            ) : (
              <div className="prescriptions-grid">
                {prescriptions.map(rx => (
                  <div key={rx.id} className="prescription-card">
                    <div className="rx-header">
                      <h4>💊 {rx.medicationName}</h4>
                      <span className={`rx-status ${rx.status?.toLowerCase()}`}>
                        {rx.status === 'active' ? '✓ Còn hiệu lực' : 
                         rx.status === 'expired' ? '✗ Hết hiệu lực' : rx.status}
                      </span>
                    </div>
                    <div className="rx-body">
                      <p><strong>Liều lượng:</strong> {rx.dosage}</p>
                      <p><strong>Tần suất:</strong> {rx.frequency}</p>
                      <p><strong>Thời hạn:</strong> {rx.duration}</p>
                      {rx.instructions && (
                        <p><strong>Hướng dẫn:</strong> {rx.instructions}</p>
                      )}
                    </div>
                    <button className="btn-view-rx" onClick={() => setSelectedPrescription(rx)}>Xem chi tiết</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prescription Detail Modal */}
          {selectedPrescription && (
            <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
              <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <h3>💊 Chi tiết Toa thuốc</h3>
                  <button onClick={() => setSelectedPrescription(null)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>✕</button>
                </div>
                <div style={{lineHeight: '1.8'}}>
                  <p><strong>Tên thuốc:</strong> {selectedPrescription.medicationName}</p>
                  <p><strong>Liều lượng:</strong> {selectedPrescription.dosage}</p>
                  <p><strong>Tần suất:</strong> {selectedPrescription.frequency}</p>
                  <p><strong>Thời hạn:</strong> {selectedPrescription.duration}</p>
                  <p><strong>Trạng thái:</strong> 
                    <span style={{marginLeft: '0.5rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: selectedPrescription.status === 'active' ? '#d4edda' : '#f8d7da', color: selectedPrescription.status === 'active' ? '#155724' : '#721c24'}}>
                      {selectedPrescription.status === 'active' ? '✓ Còn hiệu lực' : '✗ Hết hiệu lực'}
                    </span>
                  </p>
                  {selectedPrescription.instructions && (
                    <p><strong>Hướng dẫn sử dụng:</strong> {selectedPrescription.instructions}</p>
                  )}
                </div>
                <button onClick={() => setSelectedPrescription(null)} style={{marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Đóng</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;
