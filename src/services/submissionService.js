import api from './api';

export const submissionService = {
  uploadVideo: async (videoBlob) => {
    const response = await api.post('/submissions/upload-video', videoBlob, {
      headers: {
        'Content-Type': 'video/webm',
      },
    });
    return response.data;
  },

  createSubmission: async (submissionData) => {
    const response = await api.post('/submissions', submissionData);
    return response.data;
  },

  getSubmissions: async () => {
    const response = await api.get('/submissions');
    return response.data;
  },

  reviewSubmission: async (id) => {
    const response = await api.put(`/submissions/${id}/review`);
    return response.data;
  },
};
