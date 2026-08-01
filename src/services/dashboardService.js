import api from './api';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRecentPatients: async () => {
    const response = await api.get('/dashboard/recent-patients');
    return response.data;
  },

  getRecentAssessments: async () => {
    const response = await api.get('/dashboard/recent-assessments');
    return response.data;
  },

  getRecentReports: async () => {
    const response = await api.get('/dashboard/recent-reports');
    return response.data;
  },

  getActivityTimeline: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  },
};
