import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h2>Chào mừng, {user?.firstName} {user?.lastName}</h2>
          <div className="welcome-message">
            <p>Đây là hệ thống quản lý bệnh án điện tử (EHIS)</p>
            <p>Bạn có thể quản lý thông tin bệnh nhân, bệnh án, toa thuốc và kết quả xét nghiệm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
