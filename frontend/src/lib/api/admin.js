import apiClient from '../apiClient';

export const adminApi = {
  createUser: (payload) => apiClient.post('/admin/users', payload).then((r) => r.data),
  updateUser: (userId, payload) => apiClient.put(`/admin/users/${userId}`, payload).then((r) => r.data),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`).then((r) => r.data),
  getUsers: (params) => apiClient.get('/admin/users', { params }).then((r) => r.data),

  createOrganization: (payload) => apiClient.post('/admin/organizations', payload).then((r) => r.data),
  getOrganizations: () => apiClient.get('/admin/organizations').then((r) => r.data),

  createDepartment: (payload) => apiClient.post('/admin/departments', payload).then((r) => r.data),
  getDepartments: () => apiClient.get('/admin/departments').then((r) => r.data),
  deleteDepartment: (departmentId) => apiClient.delete(`/admin/departments/${departmentId}`).then((r) => r.data),

  getAnalytics: () => apiClient.get('/admin/analytics').then((r) => r.data),
  getAuditLogs: (params) => apiClient.get('/admin/audit-logs', { params }).then((r) => r.data),
  getSystemHealth: () => apiClient.get('/admin/system-health').then((r) => r.data),
};
