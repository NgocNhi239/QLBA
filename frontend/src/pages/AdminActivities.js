import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/admin-activities.css';

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/activities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      alert('Lỗi tải lịch sử hoạt động');
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      'login': '🔐',
      'logout': '🚪',
      'create': '➕',
      'update': '✏️',
      'delete': '🗑️',
      'export': '📤',
      'import': '📥',
      'report': '📊',
      'settings': '⚙️'
    };
    return icons[type] || '📝';
  };

  const getActivityColor = (type) => {
    const colors = {
      'login': 'success',
      'logout': 'info',
      'create': 'primary',
      'update': 'warning',
      'delete': 'danger',
      'export': 'secondary',
      'import': 'secondary',
      'report': 'primary',
      'settings': 'info'
    };
    return colors[type] || 'secondary';
  };

  const filteredActivities = activities.filter(activity => {
    const typeMatch = filterType === 'all' || activity.type === filterType;
    const dateMatch = !dateFilter || activity.timestamp?.startsWith(dateFilter);
    const userMatch = !userFilter || activity.user?.toLowerCase().includes(userFilter.toLowerCase());
    return typeMatch && dateMatch && userMatch;
  });

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <div className="activities-container">
          <h1>Lịch sử Hoạt động</h1>

          <div className="activities-filters">
            <div className="filter-group">
              <label>Loại hoạt động:</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="login">Đăng nhập</option>
                <option value="logout">Đăng xuất</option>
                <option value="create">Tạo mới</option>
                <option value="update">Cập nhật</option>
                <option value="delete">Xóa</option>
                <option value="export">Xuất dữ liệu</option>
                <option value="import">Nhập dữ liệu</option>
                <option value="report">Báo cáo</option>
                <option value="settings">Cài đặt</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Ngày:</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Tìm user:</label>
              <input
                type="text"
                placeholder="Nhập tên user..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>
            <button className="btn-refresh" onClick={loadActivities}>
              🔄 Làm mới
            </button>
          </div>

          <div className="activities-timeline">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id || index} className={`activity-item activity-${getActivityColor(activity.type)}`}>
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <h3>{activity.description}</h3>
                  <p className="activity-user">Người dùng: <strong>{activity.user}</strong></p>
                  <p className="activity-details">{activity.details}</p>
                  <div className="activity-meta">
                    <span className="timestamp">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleString('vi-VN') : 'N/A'}
                    </span>
                    {activity.ipAddress && (
                      <span className="ip-address">IP: {activity.ipAddress}</span>
                    )}
                  </div>
                </div>
                <div className="activity-type">
                  <span className={`type-badge type-${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </span>
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="no-activities">
                <p>Không có hoạt động nào trong bộ lọc này</p>
              </div>
            )}
          </div>

          <div className="activities-stats">
            <h2>Thống kê Hoạt động</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Tổng hoạt động</h4>
                <p className="stat-number">{activities.length}</p>
              </div>
              <div className="stat-card">
                <h4>Đăng nhập</h4>
                <p className="stat-number">
                  {activities.filter(a => a.type === 'login').length}
                </p>
              </div>
              <div className="stat-card">
                <h4>Tạo mới</h4>
                <p className="stat-number">
                  {activities.filter(a => a.type === 'create').length}
                </p>
              </div>
              <div className="stat-card">
                <h4>Cập nhật</h4>
                <p className="stat-number">
                  {activities.filter(a => a.type === 'update').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActivities;
