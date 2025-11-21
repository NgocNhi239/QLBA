import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin-system-settings.css';

const AdminSystemSettings = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    appName: 'QLBA - Electronic Health Record System',
    appVersion: '1.0.0',
    maintenanceMode: false,
    maxUploadSize: 10,
    sessionTimeout: 30,
    emailNotifications: true,
    smsNotifications: true,
    backupEnabled: true,
    backupFrequency: 'daily',
    theme: 'light',
    language: 'vi'
  });
  const [saveMessage, setSaveMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load system settings
      const response1 = await fetch('http://localhost:5000/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data1 = await response1.json();
      
      // Load user preferences
      const response2 = await fetch('http://localhost:5000/api/preferences', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data2 = await response2.json();

      if (data1.success && data1.data) {
        setSettings(prev => ({ ...prev, ...data1.data }));
      }
      
      if (data2.success && data2.data) {
        setSettings(prev => ({
          ...prev,
          theme: data2.data.theme || prev.theme,
          language: data2.data.language || prev.language,
          emailNotifications: data2.data.emailNotifications !== undefined ? data2.data.emailNotifications : prev.emailNotifications,
          smsNotifications: data2.data.smsNotifications !== undefined ? data2.data.smsNotifications : prev.smsNotifications,
          autoBackup: data2.data.autoBackup !== undefined ? data2.data.autoBackup : prev.backupEnabled,
          backupFrequency: data2.data.backupFrequency || prev.backupFrequency
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      
      // Save system settings
      const response1 = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          appName: settings.appName,
          maxUploadSize: settings.maxUploadSize,
          sessionTimeout: settings.sessionTimeout,
          maintenanceMode: settings.maintenanceMode,
          backupEnabled: settings.backupEnabled,
          backupFrequency: settings.backupFrequency
        })
      });

      // Save user preferences
      const response2 = await fetch('http://localhost:5000/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          theme: settings.theme,
          language: settings.language,
          emailNotifications: settings.emailNotifications,
          smsNotifications: settings.smsNotifications,
          autoBackup: settings.autoBackup || settings.backupEnabled,
          backupFrequency: settings.backupFrequency
        })
      });

      const data1 = await response1.json();
      const data2 = await response2.json();

      if (data1.success && data2.success) {
        setSaveMessage('Cài đặt đã được lưu thành công!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(data1.message || data2.message || 'Lỗi khi lưu cài đặt!');
      }
    } catch (error) {
      setSaveMessage('Lỗi khi lưu cài đặt!');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const performBackup = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSaveMessage(data.message || 'Sao lưu thành công!');
      } else {
        setSaveMessage(data.message || 'Lỗi khi sao lưu!');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Lỗi khi sao lưu!');
      console.error('Error backup:', error);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <div className="settings-container">
          <h1>Cài đặt Hệ thống</h1>

          {saveMessage && <div className="message-alert">{saveMessage}</div>}
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Đang tải...</div>}

          <div className="settings-section">
            <h2>Cài đặt Chung</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Tên ứng dụng</label>
                <input
                  type="text"
                  value={settings.appName}
                  onChange={(e) => handleSettingChange('appName', e.target.value)}
                />
              </div>
              <div className="setting-item">
                <label>Phiên bản ứng dụng</label>
                <input
                  type="text"
                  value={settings.appVersion}
                  disabled
                />
              </div>
              <div className="setting-item">
                <label>Kích thước tải lên tối đa (MB)</label>
                <input
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
              <div className="setting-item">
                <label>Thời gian hết phiên (phút)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  min="5"
                  max="480"
                />
              </div>
              <div className="setting-item">
                <label>Chủ đề</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                >
                  <option value="light">Sáng</option>
                  <option value="dark">Tối</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Ngôn ngữ</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="setting-item full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  />
                  Chế độ bảo trì
                </label>
              </div>
              <div className="setting-item full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  Kích hoạt thông báo Email
                </label>
              </div>
              <div className="setting-item full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  />
                  Kích hoạt thông báo SMS
                </label>
              </div>
              <div className="setting-item full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.backupEnabled || settings.autoBackup}
                    onChange={(e) => handleSettingChange('backupEnabled', e.target.checked)}
                  />
                  Kích hoạt sao lưu tự động
                </label>
              </div>
              <div className="setting-item">
                <label>Tần suất sao lưu</label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                </select>
              </div>
              <div className="setting-item">
                <button className="btn-backup" onClick={performBackup} style={{ marginTop: '10px' }}>
                  💾 Sao lưu Ngay
                </button>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn-save-settings" onClick={saveSettings} disabled={loading}>
              💾 Lưu Cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemSettings;
