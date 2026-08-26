import api from './api';

export const submissionService = {
  // Submit new practice recording
  createSubmission: async (submissionData) => {
    const response = await api.post('/submissions', submissionData);
    return response.data;
  },

  // Get list of submissions for current user role
  getSubmissions: async () => {
    const response = await api.get('/submissions');
    return response.data;
  },

  // Get submission by ID
  getSubmissionById: async (id) => {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
  },

  // Review submission and add clinician guidance
  reviewSubmission: async (id, clinicianFeedback = '') => {
    const response = await api.patch(`/submissions/${id}/review`, { clinicianFeedback });
    return response.data;
  },

  // Delete submission
  deleteSubmission: async (id) => {
    const response = await api.delete(`/submissions/${id}`);
    return response.data;
  },
};

export default submissionService;
