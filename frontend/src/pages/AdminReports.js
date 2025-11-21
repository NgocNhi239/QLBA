import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin-reports.css';

const AdminReports = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalMedicalRecords: 0,
    totalPrescriptions: 0,
    totalLabTests: 0,
    activeUsers: 0,
    monthlyGrowth: []
  });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data || {});
      } else {
        setError(data.message || 'Lỗi tải thống kê');
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `http://localhost:5000/api/admin/reports?type=${reportType}&start=${dateRange.start}&end=${dateRange.end}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setReportData(data.data || []);
      } else {
        setError(data.message || 'Lỗi tạo báo cáo');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const csv = convertToCSV(reportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${reportType}-${new Date().getTime()}.csv`;
    a.click();
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    const keys = Object.keys(data[0]);
    const header = keys.join(',');
    const rows = data.map(row => keys.map(key => row[key]).join(','));
    return [header, ...rows].join('\n');
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <div className="reports-container">
          <h1>Báo cáo và Thống kê</h1>

          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Đang tải...</div>}

          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stat-item">
              <h3>Tổng Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
              <span className="stat-label">Người dùng toàn hệ thống</span>
            </div>
            <div className="stat-item">
              <h3>Bệnh nhân</h3>
              <p className="stat-number">{stats.totalPatients}</p>
              <span className="stat-label">Số lượng bệnh nhân</span>
            </div>
            <div className="stat-item">
              <h3>Bác sĩ</h3>
              <p className="stat-number">{stats.totalDoctors}</p>
              <span className="stat-label">Số lượng bác sĩ</span>
            </div>
            <div className="stat-item">
              <h3>Hồ sơ y tế</h3>
              <p className="stat-number">{stats.totalMedicalRecords}</p>
              <span className="stat-label">Tổng hồ sơ</span>
            </div>
            <div className="stat-item">
              <h3>Đơn thuốc</h3>
              <p className="stat-number">{stats.totalPrescriptions}</p>
              <span className="stat-label">Đơn thuốc phát hành</span>
            </div>
            <div className="stat-item">
              <h3>Xét nghiệm</h3>
              <p className="stat-number">{stats.totalLabTests}</p>
              <span className="stat-label">Xét nghiệm được tạo</span>
            </div>
          </div>

          {/* Report Generator */}
          <div className="report-generator">
            <h2>Tạo Báo cáo</h2>
            <div className="generator-controls">
              <div className="control-group">
                <label>Loại báo cáo:</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option value="overview">Tổng quan</option>
                  <option value="users">Users</option>
                  <option value="patients">Bệnh nhân</option>
                  <option value="medical-records">Hồ sơ y tế</option>
                  <option value="prescriptions">Đơn thuốc</option>
                  <option value="lab-tests">Xét nghiệm</option>
                </select>
              </div>
              <div className="control-group">
                <label>Từ ngày:</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="control-group">
                <label>Đến ngày:</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
              <button className="btn-generate" onClick={generateReport}>
                Tạo báo cáo
              </button>
              {reportData.length > 0 && (
                <button className="btn-download" onClick={downloadReport}>
                  ⬇ Tải xuống CSV
                </button>
              )}
            </div>
          </div>

          {/* Report Data Table */}
          {reportData.length > 0 && (
            <div className="report-data">
              <h3>Kết quả báo cáo</h3>
              <div className="table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      {Object.keys(reportData[0]).map(key => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{String(value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="record-count">Tổng: {reportData.length} bản ghi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
