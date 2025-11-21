import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/patient-dashboard.css';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchPatientData = useCallback(async () => {
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
      }

      // Get medical records
      if (patientData.data?.id) {
        const recordsRes = await fetch(`http://localhost:5000/api/medical-records/patient/${patientData.data.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const recordsData = await recordsRes.json();
        if (recordsData.success) {
          setMedicalHistory(recordsData.data || []);
        }

        // Get prescriptions
        const presRes = await fetch(`http://localhost:5000/api/prescriptions/patient/${patientData.data.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const presData = await presRes.json();
        if (presData.success) {
          setPrescriptions(presData.data || []);
        }

        // Get lab tests
        const labRes = await fetch(`http://localhost:5000/api/lab-tests/patient/${patientData.data.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const labData = await labRes.json();
        if (labData.success) {
          setLabTests(labData.data || []);
        }

        // Get appointments
        const appointRes = await fetch(`http://localhost:5000/api/appointments/patient/${patientData.data.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const appointData = await appointRes.json();
        if (appointData.success) {
          setAppointments(appointData.data || []);
        }
      }
    } catch (err) {
      setError('Lỗi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchPatientData();
    }
  }, [user?.id, fetchPatientData]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="patient-dashboard-content">
          <h2>🧑‍🤝‍🧑 Hồ sơ sức khỏe của tôi</h2>

          {error && <div className="error-message">{error}</div>}

          {loading && <div className="loading-message">Đang tải dữ liệu...</div>}

          {!loading && (
            <>
              {/* Patient Info Card */}
              <div className="patient-info-card">
                <div className="patient-info-header">
                  <div className="patient-avatar">👤</div>
                  <div className="patient-details">
                    <h3>{user?.firstName} {user?.lastName}</h3>
                    <p>Mã bệnh nhân: {patientInfo?.medicalRecordNumber || 'N/A'}</p>
                    <p>Nhóm máu: {patientInfo?.bloodType || 'N/A'}</p>
                  </div>
                </div>
                <div className="patient-info-actions">
                  <button className="btn-patient">📝 Chỉnh sửa thông tin</button>
                  <button className="btn-patient">📞 Liên hệ bác sĩ</button>
                </div>
              </div>

              {/* Medical History */}
              <div className="patient-section">
                <h3>📋 Lịch sử khám bệnh ({medicalHistory.length})</h3>
                <div className="history-list">
                  {medicalHistory.length === 0 ? (
                    <p className="no-data">Chưa có lịch sử khám bệnh</p>
                  ) : (
                    medicalHistory.map(record => (
                      <div key={record.id} className="history-item">
                        <div className="history-left">
                          <div className="history-date">
                            {new Date(record.visitDate || record.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="history-doctor">
                            Dr. {record.doctor?.firstName} {record.doctor?.lastName}
                          </div>
                        </div>
                        <div className="history-middle">
                          <div className="history-diagnosis">{record.primaryDiagnosis}</div>
                        </div>
                        <div className="history-right">
                          <span className="history-status completed">✓ Hoàn thành</span>
                          <button className="btn-view" onClick={() => setSelectedRecord(record)}>Xem chi tiết</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Appointments */}
              <div className="patient-section">
                <h3>📅 Lịch khám sắp tới ({appointments.length})</h3>
                <div className="prescriptions-grid">
                  {appointments.length === 0 ? (
                    <p className="no-data">Chưa có lịch khám</p>
                  ) : (
                    appointments.map(apt => (
                      <div key={apt.id} className="prescription-card">
                        <div className="rx-header">
                          <h4>{new Date(apt.appointmentDate).toLocaleString('vi-VN')}</h4>
                          <span className={`rx-status ${apt.status.toLowerCase()}`}>
                            {apt.status === 'pending' && '⏳ Chờ xác nhận'}
                            {apt.status === 'confirmed' && '✓ Đã xác nhận'}
                            {apt.status === 'completed' && '✓ Đã hoàn thành'}
                            {apt.status === 'cancelled' && '✗ Đã hủy'}
                          </span>
                        </div>
                        <div className="rx-body">
                          <p><strong>Lý do:</strong> {apt.reason || 'N/A'}</p>
                        </div>
                        <button className="btn-view-rx" onClick={() => setSelectedAppointment(apt)}>Xem chi tiết</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Prescriptions */}
              <div className="patient-section">
                <h3>💊 Toa thuốc của tôi ({prescriptions.length})</h3>
                <div className="prescriptions-grid">
                  {prescriptions.length === 0 ? (
                    <p className="no-data">Chưa có toa thuốc</p>
                  ) : (
                    prescriptions.map(rx => (
                      <div key={rx.id} className="prescription-card">
                        <div className="rx-header">
                          <h4>{rx.medicationName}</h4>
                          <span className={`rx-status ${rx.status.toLowerCase()}`}>
                            {rx.status === 'active' ? '✓ Còn hiệu lực' : 
                             rx.status === 'expired' ? '✗ Hết hiệu lực' : rx.status}
                          </span>
                        </div>
                        <div className="rx-body">
                          <p><strong>Liều lượng:</strong> {rx.dosage}</p>
                          <p><strong>Tần suất:</strong> {rx.frequency}</p>
                          <p><strong>Thời hạn:</strong> {rx.duration}</p>
                          {rx.instructions && <p><strong>Hướng dẫn:</strong> {rx.instructions}</p>}
                        </div>
                        <button className="btn-view-rx" onClick={() => setSelectedPrescription(rx)}>Xem chi tiết</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Lab Tests */}
              <div className="patient-section">
                <h3>🧪 Kết quả xét nghiệm ({labTests.length})</h3>
                <div className="lab-tests-table">
                  {labTests.length === 0 ? (
                    <p className="no-data">Chưa có xét nghiệm</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Tên xét nghiệm</th>
                          <th>Ngày đặt</th>
                          <th>Trạng thái</th>
                          <th>Kết quả</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labTests.map(test => (
                          <tr key={test.id}>
                            <td>{test.testName}</td>
                            <td>{new Date(test.orderedDate || test.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td>
                              <span className={`test-status ${test.status.toLowerCase()}`}>
                                {test.status === 'pending' ? '⏳ Chờ xử lý' : 
                                 test.status === 'completed' ? '✅ Hoàn thành' : 
                                 test.status === 'abnormal' ? '⚠️ Bất thường' : test.status}
                              </span>
                            </td>
                            <td>{test.resultValue || '-'}</td>
                            <td>
                              <button className="btn-small" onClick={() => setSelectedTest(test)}>Xem kết quả</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

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

          {/* Appointment Detail Modal */}
          {selectedAppointment && (
            <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
              <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <h3>📅 Chi tiết Lịch khám</h3>
                  <button onClick={() => setSelectedAppointment(null)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>✕</button>
                </div>
                <div style={{lineHeight: '1.8'}}>
                  <p><strong>Thời gian:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleString('vi-VN')}</p>
                  <p><strong>Bác sĩ:</strong> {selectedAppointment.doctor?.user?.firstName} {selectedAppointment.doctor?.user?.lastName}</p>
                  <p><strong>Trạng thái:</strong> 
                    <span style={{marginLeft: '0.5rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: selectedAppointment.status === 'confirmed' ? '#d1ecf1' : selectedAppointment.status === 'pending' ? '#fff3cd' : '#d4edda'}}>
                      {selectedAppointment.status === 'pending' ? '⏳ Chờ xác nhận' : selectedAppointment.status === 'confirmed' ? '✓ Đã xác nhận' : '✓ Đã hoàn thành'}
                    </span>
                  </p>
                  {selectedAppointment.reason && (
                    <p><strong>Lý do:</strong> {selectedAppointment.reason}</p>
                  )}
                  {selectedAppointment.notes && (
                    <p><strong>Ghi chú:</strong> {selectedAppointment.notes}</p>
                  )}
                </div>
                <button onClick={() => setSelectedAppointment(null)} style={{marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Đóng</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
