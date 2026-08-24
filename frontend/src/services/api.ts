import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from './tokenStore';

/**
 * Single Axios instance used across the app. Feature-specific API modules
 * (authApi, partnerApi, etc.) build on this rather than creating their own
 * clients, so base config, auth headers, and refresh-token handling stay
 * in one place.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends the httpOnly refresh-token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the in-memory access token to every request.
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try exactly once to silently refresh via the httpOnly cookie
// and replay the original request. If that also fails, give up cleanly —
// callers (e.g. ProtectedRoute) treat "no user" as "logged out".
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await apiClient.post('/auth/refresh');
    const newToken: string = data.data.accessToken;
    tokenStore.set(newToken);
    return newToken;
  } catch {
    tokenStore.set(null);
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      refreshInFlight ??= refreshAccessToken().finally(() => {
        refreshInFlight = null;
      });

      const newToken = await refreshInFlight;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
