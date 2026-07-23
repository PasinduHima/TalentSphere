import apiClient from '../apiClient';

export const recruiterApi = {
  getDepartments: () => apiClient.get('/recruiter/departments').then((r) => r.data),
  getInterviewers: () => apiClient.get('/recruiter/interviewers').then((r) => r.data),

  createJob: (payload) => apiClient.post('/recruiter/jobs', payload).then((r) => r.data),
  updateJob: (jobId, payload) => apiClient.put(`/recruiter/jobs/${jobId}`, payload).then((r) => r.data),
  getMyJobs: () => apiClient.get('/recruiter/jobs').then((r) => r.data),
  deleteJob: (jobId) => apiClient.delete(`/recruiter/jobs/${jobId}`).then((r) => r.data),

  searchCandidates: (params) => apiClient.get('/recruiter/candidates', { params }).then((r) => r.data),

  getApplicationsForJob: (jobId) => apiClient.get(`/recruiter/jobs/${jobId}/applications`).then((r) => r.data),
  rankApplicationsForJob: (jobId) => apiClient.post(`/recruiter/jobs/${jobId}/applications/rank`).then((r) => r.data),
  updateApplicationStatus: (applicationId, payload) =>
    apiClient.put(`/recruiter/applications/${applicationId}/status`, payload).then((r) => r.data),

  scheduleInterview: (payload) => apiClient.post('/recruiter/interviews', payload).then((r) => r.data),
  getInterviews: () => apiClient.get('/recruiter/interviews').then((r) => r.data),
};
