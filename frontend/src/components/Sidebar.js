import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Trang chủ', icon: '🏠' }
    ];

    const adminItems = [
      { path: '/dashboard', label: 'Trang chủ', icon: '🏠' },
      { path: '/admin/users', label: 'Quản lý Users', icon: '👥' },
      { path: '/admin/doctors', label: 'Quản lý Bác sĩ', icon: '👨‍⚕️' },
      { path: '/admin/reports', label: 'Báo cáo & Thống kê', icon: '📊' },
      { path: '/admin/activities', label: 'Lịch sử Hoạt động', icon: '📝' },
      { path: '/admin/settings', label: 'Cài đặt Hệ thống', icon: '⚙️' }
    ];

    const doctorItems = [
      { path: '/dashboard', label: 'Trang chủ', icon: '🏠' },
      { path: '/doctor/benh-an', label: 'Bệnh án', icon: '📋' },
      { path: '/doctor/patients', label: 'Bệnh nhân', icon: '👥' },
      { path: '/doctor/prescriptions', label: 'Toa thuốc', icon: '💊' },
      { path: '/doctor/lab-tests', label: 'Xét nghiệm', icon: '🧪' },
      { path: '/doctor/appointments', label: 'Lịch khám', icon: '📅' }
    ];

    const patientItems = [
      { path: '/dashboard', label: 'Hồ sơ sức khỏe', icon: '🏠' },
      { path: '/medical-history', label: 'Lịch sử khám', icon: '📋' },
      { path: '/my-prescriptions', label: 'Toa thuốc của tôi', icon: '💊' },
      { path: '/my-tests', label: 'Xét nghiệm', icon: '🧪' },
      { path: '/appointments', label: 'Lịch khám', icon: '📅' },
      { path: '/health-records', label: 'Hồ sơ sức khỏe', icon: '❤️' }
    ];

    switch (user?.role) {
      case 'admin':
        return adminItems;
      case 'doctor':
        return doctorItems;
      case 'patient':
        return patientItems;
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>QLBA</h3>
        <div className="role-badge">{user?.role}</div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
