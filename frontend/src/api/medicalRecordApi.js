import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getMedicalRecords = (patientId) => {
  return axios.get(`${API_URL}/medical-records/patient/${patientId}`, getHeaders());
};

export const getMedicalRecordById = (id) => {
  return axios.get(`${API_URL}/medical-records/${id}`, getHeaders());
};

export const createMedicalRecord = (data) => {
  return axios.post(`${API_URL}/medical-records`, data, getHeaders());
};

export const updateMedicalRecord = (id, data) => {
  return axios.put(`${API_URL}/medical-records/${id}`, data, getHeaders());
};
