import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin-user-management.css';

const AdminUserManagement = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient',
    phone: '',
    address: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      } else {
        setError(data.message || 'Lỗi tải danh sách users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
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
      const endpoint = editingUser
        ? `http://localhost:5000/api/admin/users/${editingUser.id}`
        : 'http://localhost:5000/api/auth/register';
      
      const response = await fetch(endpoint, {
        method: editingUser ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        loadUsers();
        setShowForm(false);
        setEditingUser(null);
        setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'patient', phone: '', address: '' });
        alert(editingUser ? 'Cập nhật user thành công!' : 'Tạo user thành công!');
      } else {
        alert(data.message || 'Lỗi!');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Lỗi khi lưu user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || '',
      address: user.address || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          loadUsers();
          alert('Xóa user thành công!');
        } else {
          alert(data.message || 'Lỗi!');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Lỗi khi xóa user');
      }
    }
  };

  const filteredUsers = (users || []).filter(user => {
    if (!user) return false;
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const email = user.email || '';
    const matchSearch = fullName.includes(searchTerm.toLowerCase()) ||
                       email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <div className="user-management-container">
          <div className="user-header">
            <h1>Quản lý Users</h1>
            <button className="btn-add" onClick={() => {
              setEditingUser(null);
              setFormData({ name: '', email: '', role: 'patient', phone: '', address: '' });
              setShowForm(true);
            }}>
              + Thêm User
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Đang tải...</div>}

          <div className="user-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="filter-select">
              <option value="all">Tất cả roles</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          {showForm && (
            <div className="user-form-container">
              <div className="form-header">
                <h2>{editingUser ? 'Chỉnh sửa User' : 'Thêm User Mới'}</h2>
                <button className="btn-close" onClick={() => setShowForm(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tên *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!!editingUser}
                    required
                  />
                </div>
                {!editingUser && (
                  <div className="form-group">
                    <label>Mật khẩu *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label>Vai trò *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn-save">
                    {editingUser ? 'Cập nhật' : 'Tạo'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                    <td>{user.phone || '-'}</td>
                    <td>{user.address || '-'}</td>
                    <td className="action-cell">
                      <button className="btn-edit" onClick={() => handleEdit(user)}>Sửa</button>
                      <button className="btn-delete" onClick={() => handleDelete(user.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="no-data">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
