import React, { useState, useEffect } from 'react';
import { getAllPatients } from '../api/patientApi';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/patients.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getAllPatients();
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="patients-content">
          <h2>Danh sách Bệnh nhân</h2>
          {error && <div className="error">{error}</div>}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã BN</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>Nhóm máu</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={patient.id}>
                    <td>{index + 1}</td>
                    <td>{patient.medicalRecordNumber}</td>
                    <td>{patient.User.firstName} {patient.User.lastName}</td>
                    <td>{patient.User.email}</td>
                    <td>{new Date(patient.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                    <td>{patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}</td>
                    <td>{patient.bloodType}</td>
                    <td>
                      <button className="btn-view">Xem chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
