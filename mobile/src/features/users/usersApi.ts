import { apiClient } from '@/services/api';
import type { ApiSuccessResponse } from '@/types/api';
import type { ChangePasswordPayload, PublicUser, UpdateProfilePayload } from './types';

/** Shape expo-image-picker gives us — enough to build a React Native FormData file part. */
export interface PickedImage {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
}

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

  async uploadProfileImage(image: PickedImage) {
    // React Native's FormData expects a { uri, name, type } object for a
    // file part rather than a web File/Blob — this is the standard RN
    // multipart-upload shape.
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.fileName ?? `profile-${Date.now()}.jpg`,
      type: image.mimeType ?? 'image/jpeg',
    } as unknown as Blob);

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
