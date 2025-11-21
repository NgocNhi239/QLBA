import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin-doctor-management.css';

const AdminDoctorManagement = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    availableSlots: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDoctors();
    loadUsers();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/doctors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data || []);
      } else {
        setError(data.message || 'Lỗi tải danh sách bác sĩ');
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers((data.data || []).filter(u => u.role !== 'doctor'));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingDoctor
        ? `http://localhost:5000/api/doctors/${editingDoctor.id}`
        : 'http://localhost:5000/api/doctors';

      const response = await fetch(endpoint, {
        method: editingDoctor ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        loadDoctors();
        setShowForm(false);
        setEditingDoctor(null);
        setFormData({
          userId: '',
          specialization: '',
          licenseNumber: '',
          yearsOfExperience: '',
          availableSlots: ''
        });
        alert(editingDoctor ? 'Cập nhật bác sĩ thành công!' : 'Tạo bác sĩ thành công!');
      } else {
        alert(data.message || 'Lỗi!');
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert('Lỗi khi lưu bác sĩ');
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      userId: doctor.userId,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      yearsOfExperience: doctor.yearsOfExperience,
      availableSlots: doctor.availableSlots
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bác sĩ này?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          loadDoctors();
          alert('Xóa bác sĩ thành công!');
        } else {
          alert(data.message || 'Lỗi!');
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Lỗi khi xóa bác sĩ');
      }
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <div className="doctor-management-container">
          <div className="doctor-header">
            <h1>Quản lý Bác sĩ</h1>
            <button className="btn-add" onClick={() => {
              setEditingDoctor(null);
              setFormData({
                userId: '',
                specialization: '',
                licenseNumber: '',
                yearsOfExperience: '',
                availableSlots: ''
              });
              setShowForm(true);
            }}>
              + Thêm Bác sĩ
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Đang tải...</div>}

          {showForm && (
            <div className="doctor-form-container">
              <div className="form-header">
                <h2>{editingDoctor ? 'Chỉnh sửa Bác sĩ' : 'Thêm Bác sĩ Mới'}</h2>
                <button className="btn-close" onClick={() => setShowForm(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Chọn User *</label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    disabled={!!editingDoctor}
                    required
                  >
                    <option value="">-- Chọn User --</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Chuyên khoa *</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="VD: Tim mạch, Nhi khoa"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Số giấy phép *</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Kinh nghiệm (năm)</label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số slot khám</label>
                    <input
                      type="number"
                      name="availableSlots"
                      value={formData.availableSlots}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn-save">
                    {editingDoctor ? 'Cập nhật' : 'Tạo'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="doctors-grid">
            {doctors.map(doctor => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-header-card">
                  <div className="doctor-avatar">
                    {doctor.user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="doctor-info-header">
                    <h3>{doctor.user?.firstName} {doctor.user?.lastName}</h3>
                    <p className="specialization">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="doctor-details">
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{doctor.user?.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Giấy phép:</span>
                    <span className="value">{doctor.licenseNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Kinh nghiệm:</span>
                    <span className="value">{doctor.yearsOfExperience} năm</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Slot khám:</span>
                    <span className="value slots">{doctor.availableSlots}</span>
                  </div>
                </div>
                <div className="doctor-actions">
                  <button className="btn-edit" onClick={() => handleEdit(doctor)}>Chỉnh sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(doctor.id)}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
          {doctors.length === 0 && (
            <div className="no-data">Không có dữ liệu bác sĩ</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDoctorManagement;
