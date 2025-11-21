import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/doctor-patients.css';

const DoctorPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/patients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPatients(data.data);
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

  const filteredPatients = patients.filter(record =>
    record.patient?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient?.medicalRecordNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="dashboard-container"><Sidebar /><div>Đang tải...</div></div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="doctor-patients-container">
          <h1>👥 Quản lý Bệnh nhân</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="patients-table">
            <table>
              <thead>
                <tr>
                  <th>Tên bệnh nhân</th>
                  <th>Mã hồ sơ</th>
                  <th>Email</th>
                  <th>Điện thoại</th>
                  <th>Ngày sinh</th>
                  <th>Chẩn đoán chính</th>
                  <th>Ngày khám</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((record) => (
                  <tr key={record.id}>
                    <td>
                      {record.patient?.user?.firstName} {record.patient?.user?.lastName}
                    </td>
                    <td>{record.patient?.medicalRecordNumber}</td>
                    <td>{record.patient?.user?.email}</td>
                    <td>{record.patient?.user?.phone || 'N/A'}</td>
                    <td>
                      {record.patient?.dateOfBirth 
                        ? new Date(record.patient.dateOfBirth).toLocaleDateString('vi-VN')
                        : 'N/A'
                      }
                    </td>
                    <td>{record.primaryDiagnosis || 'Chưa có'}</td>
                    <td>{new Date(record.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button 
                        className="btn-view"
                        onClick={() => navigate(`/doctor/patients/${record.patientId}/records`)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length === 0 && (
              <p className="no-data">Không có bệnh nhân</p>
            )}
          </div>

          <p className="record-count">Tổng: {filteredPatients.length} bệnh nhân</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
