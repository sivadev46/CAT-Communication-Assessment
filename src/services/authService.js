import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.token) {
      localStorage.setItem('cat_token', response.data.data.token);
      localStorage.setItem('cat_user', JSON.stringify(response.data.data.user));
      localStorage.setItem('cat_is_authenticated', 'true');
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    if (response.data?.data?.user) {
      localStorage.setItem('cat_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore API errors on logout
    } finally {
      localStorage.removeItem('cat_token');
      localStorage.removeItem('cat_user');
      localStorage.removeItem('cat_is_authenticated');
    }
  },
};
