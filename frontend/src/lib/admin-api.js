import axios from 'axios';

const BASE = 'http://localhost:8000';
const API_BASE = `${BASE}/api/v1`;

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  getSummary: () => adminApi.get('/admin_dashboard/summary/'),

  getUsers: (params) => adminApi.get('/admin_dashboard/users/', { params }),
  getUser: (id) => adminApi.get(`/admin_dashboard/users/${id}/`),
  updateUser: (id, data) => adminApi.patch(`/admin_dashboard/users/${id}/`, data),
  toggleUserActive: (id) => adminApi.post(`/admin_dashboard/users/${id}/toggle_user_active/`),

  getProperties: (params) => adminApi.get('/admin_dashboard/properties/', { params }),
  getProperty: (id) => adminApi.get(`/admin_dashboard/properties/${id}/`),
  updateProperty: (id, data) => adminApi.patch(`/admin_dashboard/properties/${id}/`, data),
  deleteProperty: (id) => adminApi.delete(`/admin_dashboard/properties/${id}/`),

  getBookings: (params) => adminApi.get('/admin_dashboard/bookings/', { params }),
  approveBooking: (id) => adminApi.post(`/admin_dashboard/bookings/${id}/approve_booking/`),

  getPayments: (params) => adminApi.get('/admin_dashboard/payments/', { params }),

  getContracts: (params) => adminApi.get('/admin_dashboard/contracts/', { params }),

  getAgents: (params) => adminApi.get('/admin_dashboard/agents/', { params }),
  verifyAgent: (id) => adminApi.post(`/admin_dashboard/agents/${id}/verify_agent/`),

  getLogs: (params) => adminApi.get('/admin_dashboard/logs/', { params }),
  getStats: (params) => adminApi.get('/admin_dashboard/stats/', { params }),
};

export default adminApi;
