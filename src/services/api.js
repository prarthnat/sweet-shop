// src/services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // proxy to backend (package.json "proxy": "http://localhost:3001")
  timeout: 5000,
});

// Helpers for Auth
export const registerUser = (payload) => api.post('/auth/register', payload).then(r => r.data);
export const loginUser = (payload) => api.post('/auth/login', payload).then(r => r.data);

// Sweets API
export const fetchSweetsAPI = () => api.get('/sweets').then(r => r.data);
export const getSweetById = (id) => api.get(`/sweets/${id}`).then(r => r.data);
export const createSweet = (payload) => api.post('/sweets', payload).then(r => r.data);
export const updateSweet = (id, payload) => api.put(`/sweets/${id}`, payload).then(r => r.data);
export const deleteSweet = (id) => api.delete(`/sweets/${id}`).then(r => r.data);

// export default named variable to satisfy ESLint
const http = api;
export default http;
