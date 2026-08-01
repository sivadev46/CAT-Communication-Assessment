import api from './api';

export const assessmentService = {
  createAssessment: async (assessmentData) => {
    const response = await api.post('/assessments', assessmentData);
    return response.data;
  },

  getAssessment: async (id) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  },

  getAssessmentsByPatient: async (patientId) => {
    const response = await api.get(`/assessments/patient/${patientId}`);
    return response.data;
  },

  updateAssessment: async (id, assessmentData) => {
    const response = await api.put(`/assessments/${id}`, assessmentData);
    return response.data;
  },

  deleteAssessment: async (id) => {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  },
};
