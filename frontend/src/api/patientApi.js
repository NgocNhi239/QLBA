import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllPatients = () => {
  return axios.get(`${API_URL}/patients`, getHeaders());
};

export const getPatientById = (id) => {
  return axios.get(`${API_URL}/patients/${id}`, getHeaders());
};

export const createPatient = (data) => {
  return axios.post(`${API_URL}/patients`, data, getHeaders());
};

export const updatePatient = (id, data) => {
  return axios.put(`${API_URL}/patients/${id}`, data, getHeaders());
};
