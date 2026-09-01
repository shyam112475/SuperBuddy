import { apiClient } from '@/services/api';
import type { ApiSuccessResponse } from '@/types/api';
import type { AuthResponse, LoginPayload, PublicUser, RegisterPayload } from './types';

export const authApi = {
  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>('/auth/register', payload);
    return data.data;
  },

  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>('/auth/login', payload);
    return data.data;
  },

  async logout(refreshToken: string | null) {
    await apiClient.post('/auth/logout', refreshToken ? { refreshToken } : undefined);
  },

  async forgotPassword(email: string) {
    await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string) {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },

  async me() {
    const { data } = await apiClient.get<ApiSuccessResponse<{ user: PublicUser }>>('/auth/me');
    return data.data.user;
  },
};
