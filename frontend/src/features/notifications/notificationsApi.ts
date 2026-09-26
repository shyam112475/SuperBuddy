import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type { NotificationListResult } from './types';

export const notificationsApi = {
  async list(page = 1) {
    const { data } = await apiClient.get<ApiSuccessResponse<NotificationListResult>>(
      '/notifications',
      { params: { page } }
    );
    return data.data;
  },

  async markRead(id: string) {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllRead() {
    await apiClient.patch('/notifications/read-all');
  },
};
