import axios from 'axios';

const normalizeApiUrl = (value) => {
  const raw = (value || '').trim();
  if (!raw) return 'http://localhost:5000/api';

  const withoutTrailingSlash = raw.replace(/\/+$/, '');
  return /\/api(?:\/)?$/i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
};

const configuredApiUrl = normalizeApiUrl(import.meta.env.VITE_API_URL);
const isLocalHost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

let API_BASE = configuredApiUrl;

if (!import.meta.env.VITE_API_URL && !isLocalHost) {
  console.error('Missing VITE_API_URL in production. Set your Render backend URL in the Vercel project environment variables.');
}

// Keep local dev behavior for phone testing, but do not silently rewrite a production URL to localhost.
try {
  if (typeof window !== 'undefined' && isLocalHost) {
    const locHost = window.location.hostname;
    if (locHost && locHost !== 'localhost') {
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
