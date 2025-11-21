import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/patient-dashboard.css';

const PatientLabTests = () => {
  const { user } = useContext(AuthContext);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

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
        // Get lab tests
        const labRes = await fetch(`http://localhost:5000/api/lab-tests/patient/${patientData.data.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const labData = await labRes.json();
        if (labData.success) {
          setLabTests(labData.data || []);
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
          <h2>🧪 Xét nghiệm của tôi</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="patient-section">
            {labTests.length === 0 ? (
              <p className="no-data">Chưa có xét nghiệm nào</p>
            ) : (
              <div className="lab-tests-table">
                <table>
                  <thead>
                    <tr>
                      <th>Tên xét nghiệm</th>
                      <th>Ngày đặt</th>
                      <th>Trạng thái</th>
                      <th>Kết quả</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labTests.map(test => (
                      <tr key={test.id} onClick={() => setSelectedTest(test)} style={{cursor: 'pointer'}}>
                        <td><strong>{test.testName}</strong></td>
                        <td>{new Date(test.orderedDate || test.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <span className={`test-status ${test.status?.toLowerCase()}`}>
                            {test.status === 'pending' ? '⏳ Chờ xử lý' : 
                             test.status === 'completed' ? '✅ Hoàn thành' : 
                             test.status === 'abnormal' ? '⚠️ Bất thường' : test.status}
                          </span>
                        </td>
                        <td>{test.resultValue || '-'}</td>
                        <td>{test.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Lab Test Detail Modal */}
          {selectedTest && (
            <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
              <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <h3>🧪 Kết quả Xét nghiệm</h3>
                  <button onClick={() => setSelectedTest(null)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>✕</button>
                </div>
                <div style={{lineHeight: '1.8'}}>
                  <p><strong>Loại xét nghiệm:</strong> {selectedTest.testName}</p>
                  <p><strong>Ngày đặt:</strong> {new Date(selectedTest.orderedDate || selectedTest.createdAt).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Trạng thái:</strong> 
                    <span style={{marginLeft: '0.5rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: selectedTest.status === 'completed' ? '#d4edda' : selectedTest.status === 'pending' ? '#fff3cd' : '#f8d7da'}}>
                      {selectedTest.status === 'pending' ? '⏳ Chờ xử lý' : selectedTest.status === 'completed' ? '✅ Hoàn thành' : '⚠️ Bất thường'}
                    </span>
                  </p>
                  <p><strong>Kết quả:</strong> {selectedTest.resultValue || 'Chưa có kết quả'}</p>
                  {selectedTest.notes && (
                    <p><strong>Ghi chú:</strong> {selectedTest.notes}</p>
                  )}
                </div>
                <button onClick={() => setSelectedTest(null)} style={{marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Đóng</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientLabTests;
