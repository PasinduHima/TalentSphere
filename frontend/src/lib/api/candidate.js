import apiClient from '../apiClient';

export const candidateApi = {
  getProfile: () => apiClient.get('/candidate/profile').then((r) => r.data),
  updateProfile: (payload) => apiClient.put('/candidate/profile', payload).then((r) => r.data),

  getResumes: () => apiClient.get('/candidate/resumes').then((r) => r.data),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post('/candidate/resumes', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  setPrimaryResume: (resumeId) => apiClient.put(`/candidate/resumes/${resumeId}/primary`).then((r) => r.data),
  deleteResume: (resumeId) => apiClient.delete(`/candidate/resumes/${resumeId}`).then((r) => r.data),

  searchJobs: (params) => apiClient.get('/candidate/jobs', { params }).then((r) => r.data),
  getJob: (jobId) => apiClient.get(`/candidate/jobs/${jobId}`).then((r) => r.data),
  getRecommendedJobs: (take = 10) => apiClient.get('/candidate/jobs/recommended', { params: { take } }).then((r) => r.data),

  applyToJob: (payload) => apiClient.post('/candidate/applications', payload).then((r) => r.data),
  getApplications: () => apiClient.get('/candidate/applications').then((r) => r.data),
};
