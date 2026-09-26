import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type { AuthResponse, LoginPayload, RegisterPayload, PublicUser } from './types';

export const authApi = {
  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      '/auth/register',
      payload
    );
    return data.data;
  },

  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      '/auth/login',
      payload
    );
    return data.data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
  },

  async forgotPassword(email: string) {
    const { data } = await apiClient.post<ApiSuccessResponse<null>>('/auth/forgot-password', {
      email,
    });
    return data;
  },

  async resetPassword(token: string, newPassword: string) {
    const { data } = await apiClient.post<ApiSuccessResponse<null>>('/auth/reset-password', {
      token,
      newPassword,
    });
    return data;
  },

  async me() {
    const { data } = await apiClient.get<ApiSuccessResponse<{ user: PublicUser }>>('/auth/me');
    return data.data.user;
  },
};
