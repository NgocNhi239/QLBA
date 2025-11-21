import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const login = (credentials) => {
  return axios.post(`${API_URL}/auth/login`, credentials);
};

export const register = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
