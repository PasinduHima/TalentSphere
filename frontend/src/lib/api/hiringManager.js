import apiClient from '../apiClient';

export const hiringManagerApi = {
  getShortlisted: () => apiClient.get('/hiring-manager/shortlisted').then((r) => r.data),
  submitFeedback: (payload) => apiClient.post('/hiring-manager/feedback', payload).then((r) => r.data),
  getFeedbackForApplication: (applicationId) =>
    apiClient.get(`/hiring-manager/applications/${applicationId}/feedback`).then((r) => r.data),
  recordDecision: (payload) => apiClient.post('/hiring-manager/decisions', payload).then((r) => r.data),
  getDecisions: () => apiClient.get('/hiring-manager/decisions').then((r) => r.data),

  generateInterviewQuestions: (payload) =>
    apiClient.post('/hiring-manager/ai/interview-questions', payload).then((r) => r.data),
};
