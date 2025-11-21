import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="header">
      <div className="header-left">
        <h1>Hệ thống Quản lý Bệnh án Điện tử</h1>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span>{user?.firstName} {user?.lastName}</span>
          <span className="role">({user?.role})</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
      </div>
    </div>
  );
};

export default Header;
