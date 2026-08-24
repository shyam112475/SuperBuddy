import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type { BlockedUser, CreateReportPayload } from './types';

export const safetyApi = {
  async createReport(payload: CreateReportPayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<{ report: unknown }>>(
      '/reports',
      payload
    );
    return data.data.report;
  },

  async blockUser(blockedUserId: string) {
    await apiClient.post('/blocks', { blockedUserId });
  },

  async unblockUser(blockedUserId: string) {
    await apiClient.delete(`/blocks/${blockedUserId}`);
  },

  async listMyBlocks() {
    const { data } = await apiClient.get<ApiSuccessResponse<{ blocks: BlockedUser[] }>>('/blocks');
    return data.data.blocks;
  },
};
