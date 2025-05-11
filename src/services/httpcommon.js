import axios from 'axios';


const authToken = sessionStorage.getItem("authToken");

const http = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` })
  },
});

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default http;
