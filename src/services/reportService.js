import api from './api';

export const reportService = {
  generateReport: async (reportData) => {
    const response = await api.post('/reports/generate', reportData);
    return response.data;
  },

  generateAIReport: async (reportData) => {
    const response = await api.post('/reports/generate-ai', reportData);
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  getReport: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  updateReport: async (id, reportData) => {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  shareReport: async (id, email) => {
    const response = await api.post(`/reports/${id}/share`, { email });
    return response.data;
  },
};
