import apiClient from '../apiClient';

export const authApi = {
  register: (payload) => apiClient.post('/auth/register', payload).then((r) => r.data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }).then((r) => r.data),
  refresh: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }).then((r) => r.data),
  logout: (refreshToken) => apiClient.post('/auth/logout', { refreshToken }).then((r) => r.data),
  me: () => apiClient.get('/auth/me').then((r) => r.data),
  changePassword: (payload) => apiClient.post('/auth/change-password', payload).then((r) => r.data),
};
