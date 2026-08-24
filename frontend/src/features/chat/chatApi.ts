import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type { MessageListResult } from './types';

export const chatApi = {
  async listMessages(bookingId: string) {
    const { data } = await apiClient.get<ApiSuccessResponse<MessageListResult>>(
      `/chat/${bookingId}/messages`,
      { params: { limit: 100 } }
    );
    return data.data;
  },

  async markRead(bookingId: string) {
    await apiClient.patch(`/chat/${bookingId}/read`);
  },
};
