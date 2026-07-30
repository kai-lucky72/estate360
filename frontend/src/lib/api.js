import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE = `${BASE}/api/v1`;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const resp = await axios.post(`${BASE}/api/token/refresh/`, { refresh: refreshToken });
          localStorage.setItem('access_token', resp.data.access);
          originalRequest.headers.Authorization = `Bearer ${resp.data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const getTokenPayload = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return null; }
};

export const authAPI = {
  login: async (email, password) => {
    const response = await axios.post(`${BASE}/api/token/`, { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await axios.post(`${API_BASE}/accounts/users/register/`, userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  },
  getUser: async () => {
    const response = await api.get('/accounts/users/me/');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.patch('/accounts/users/me/', data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await api.post('/accounts/users/change_password/', data);
    return response.data;
  },
};

export const propertyAPI = {
  getProperties: async (params) => {
    const response = await api.get('/properties/properties/', { params });
    return response.data;
  },
  getProperty: async (id) => {
    const response = await api.get(`/properties/properties/${id}/`);
    return response.data;
  },
  createProperty: async (data) => {
    const response = await api.post('/properties/properties/', data);
    return response.data;
  },
  updateProperty: async (id, data) => {
    const response = await api.patch(`/properties/properties/${id}/`, data);
    return response.data;
  },
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/properties/${id}/`);
    return response.data;
  },
};

export const agentAPI = {
  getAgents: async () => {
    const response = await api.get('/agents/');
    return response.data;
  },
  getAgent: async (id) => {
    const response = await api.get(`/agents/${id}/`);
    return response.data;
  },
};

export const bookingAPI = {
  createBooking: (data) => api.post('/bookings/bookings/', data),
  getMyBookings: () => api.get('/bookings/bookings/'),
  getBooking: (id) => api.get(`/bookings/bookings/${id}/`),
  cancelBooking: (id) => api.patch(`/bookings/bookings/${id}/`, { status: 'cancelled' }),
};

export const paymentAPI = {
  makePayment: (data) => api.post('/payments/payments/', data),
  getMyPayments: () => api.get('/payments/payments/'),
};

export const reviewAPI = {
  createReview: (data) => api.post('/reviews/reviews/', data),
  getPropertyReviews: (id) => api.get(`/reviews/reviews/?property=${id}`),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications/notifications/'),
  markRead: (id) => api.post(`/notifications/notifications/${id}/mark_read/`),
  markAllRead: () => api.post('/notifications/notifications/mark_all_read/'),
};

export const dashboardAPI = {
  getSummary: () => api.get('/admin_dashboard/summary/'),
};

export default api;
