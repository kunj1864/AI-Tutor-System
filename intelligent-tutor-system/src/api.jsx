// src/api.js

import axios from 'axios';

// 🛑 Purana Localhost wala (Abhi comment kar diya hai)
// const API_URL = 'http://127.0.0.1:8000/api/';

// ✅ NAYA LIVE URL (Render se milne ke baad yahan daalna)
// Last me '/api/' lagana mat bhoolna!
const API_URL = 'https://ai-tutor-system-1.onrender.com/api/'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;