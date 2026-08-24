import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type { ChangePasswordPayload, PublicUser, UpdateProfilePayload } from './types';

export const usersApi = {
  async getMe() {
    const { data } = await apiClient.get<ApiSuccessResponse<{ user: PublicUser }>>('/users/me');
    return data.data.user;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const { data } = await apiClient.put<ApiSuccessResponse<{ user: PublicUser }>>(
      '/users/me',
      payload
    );
    return data.data.user;
  },

  async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await apiClient.post<ApiSuccessResponse<{ user: PublicUser }>>(
      '/users/me/profile-image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data.user;
  },

  async changePassword(payload: ChangePasswordPayload) {
    await apiClient.patch('/users/me/password', payload);
  },

  async deleteAccount() {
    await apiClient.delete('/users/me');
  },
};
