import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/constants/env';
import { tokenStore } from './tokenStore';
import { secureStorage } from './secureStorage';
import type { ApiSuccessResponse } from '@/types/api';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A plain client (no interceptors) for the refresh call itself — using
// `apiClient` here would recurse through the 401 handler below.
const refreshClient = axios.create({ baseURL: env.apiUrl });

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

let refreshPromise: Promise<RefreshResult | null> | null = null;

/**
 * Ensures only one refresh request is ever in flight at a time — if five
 * requests all get a 401 within the same moment (e.g. right after the
 * access token expires), they all await the same promise instead of firing
 * five separate refresh calls and racing to rotate the token.
 */
async function refreshTokens(): Promise<RefreshResult | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const storedRefreshToken = await secureStorage.getRefreshToken();
      if (!storedRefreshToken) return null;

      const { data } = await refreshClient.post<
        ApiSuccessResponse<{ accessToken: string; refreshToken: string }>
      >('/auth/refresh', { refreshToken: storedRefreshToken });

      tokenStore.set(data.data.accessToken);
      await secureStorage.setRefreshToken(data.data.refreshToken);
      return data.data;
    } catch {
      tokenStore.set(null);
      await secureStorage.clearRefreshToken();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const result = await refreshTokens();

      if (result) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
