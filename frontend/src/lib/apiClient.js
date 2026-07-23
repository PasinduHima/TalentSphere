import axios from 'axios';
import { tokenStorage } from './tokenStorage';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5185/api';

export const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  // Plain axios call (not `apiClient`) so this request never re-enters the
  // response interceptor below and can't trigger an infinite refresh loop.
  const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
  tokenStorage.setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && config && !config._retry) {
      config._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null; });
        const newAccessToken = await refreshPromise;
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(config);
      } catch {
        tokenStorage.clear();
        localStorage.removeItem('auth-storage');
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === 'string') return data;
  if (data.errors) {
    const firstKey = Object.keys(data.errors)[0];
    const firstError = data.errors[firstKey];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }
  return data.title || fallback;
}

export default apiClient;
