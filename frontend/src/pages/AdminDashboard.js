import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/admin-dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalMedicalRecords: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchActivities();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(prev => ({
          ...prev,
          totalUsers: data.data.totalUsers,
          totalPatients: data.data.totalPatients,
          totalDoctors: data.data.totalDoctors,
          totalMedicalRecords: data.data.totalMedicalRecords
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Lỗi tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/activities', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const recent = data.data.slice(0, 3).map(activity => ({
          id: activity.id,
          user: activity.user,
          action: activity.description,
          time: activity.timestamp ? new Date(activity.timestamp).toLocaleString('vi-VN') : 'N/A'
        }));
        setStats(prev => ({
          ...prev,
          recentActivity: recent
        }));
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'add-user':
        navigate('/admin/users');
        break;
      case 'add-doctor':
        navigate('/admin/doctors');
        break;
      case 'reports':
        navigate('/admin/reports');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="admin-dashboard-content">
          <h2>👨‍💼 Admin Dashboard</h2>
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Đang tải dữ liệu...</div>}
          
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-label">Tổng Người dùng</div>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🧑‍🤝‍🧑</div>
              <div className="stat-info">
                <div className="stat-label">Bệnh nhân</div>
                <div className="stat-value">{stats.totalPatients}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-info">
                <div className="stat-label">Bác sĩ</div>
                <div className="stat-value">{stats.totalDoctors}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <div className="stat-label">Bệnh án</div>
                <div className="stat-value">{stats.totalMedicalRecords}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="admin-section">
            <h3>Hành động nhanh</h3>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => handleQuickAction('add-user')}>➕ Thêm người dùng mới</button>
              <button className="action-btn" onClick={() => handleQuickAction('add-doctor')}>👨‍⚕️ Thêm bác sĩ</button>
              <button className="action-btn" onClick={() => handleQuickAction('reports')}>📊 Xuất báo cáo</button>
              <button className="action-btn" onClick={() => handleQuickAction('settings')}>⚙️ Quản lý cài đặt</button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-section">
            <h3>Hoạt động gần đây</h3>
            <div className="activity-list">
              {stats.recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-user">{activity.user}</div>
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="admin-section">
            <h3>Trạng thái hệ thống</h3>
            <div className="status-grid">
              <div className="status-item">
                <span>Database</span>
                <span className="status-badge online">🟢 Online</span>
              </div>
              <div className="status-item">
                <span>API Server</span>
                <span className="status-badge online">🟢 Online</span>
              </div>
              <div className="status-item">
                <span>Backup Status</span>
                <span className="status-badge online">🟢 Completed</span>
              </div>
              <div className="status-item">
                <span>Uptime</span>
                <span className="status-badge online">🟢 99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
