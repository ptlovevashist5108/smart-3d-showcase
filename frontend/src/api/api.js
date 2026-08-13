import axios from 'axios';

let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// If running the frontend from another device (phone) but the API_BASE
// still points to localhost, replace localhost with the current host so
// resources (like /uploads/...) resolve to the dev machine's IP.
try {
  if (typeof window !== 'undefined') {
    const locHost = window.location.hostname;
      if (locHost && locHost !== 'localhost') {
        // Replace common local hostnames so the backend is reachable from other devices
        API_BASE = API_BASE.replace(/localhost|127\.0\.0\.1/g, locHost);
      }
  }
} catch (e) {
  // ignore - keep default
}

export const SERVER_BASE = API_BASE.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE
});

// Attach admin token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

export const submitContact = (data) => api.post('/contact', data);
export const getContacts = () => api.get('/contact');
export const getProfile = () => api.get('/auth/me');
export const getPublicProfile = () => api.get('/auth/public/profile');
export const updateBossPhoto = (boss_photo) => api.put('/auth/boss-photo', { boss_photo });
export const updateBossName = (name) => api.put('/auth/boss-name', { name });

export const uploadPhoto = (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export default api;
