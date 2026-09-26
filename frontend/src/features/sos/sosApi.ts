import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type { CreateSOSAlertPayload, SOSAlert } from './types';

export const sosApi = {
  async create(payload: CreateSOSAlertPayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<{ alert: SOSAlert }>>(
      '/sos',
      payload
    );
    return data.data.alert;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<ApiSuccessResponse<{ alert: SOSAlert }>>(`/sos/${id}`);
    return data.data.alert;
  },

  async resolve(id: string, status: 'RESOLVED' | 'FALSE_ALARM', note?: string) {
    const { data } = await apiClient.patch<ApiSuccessResponse<{ alert: SOSAlert }>>(
      `/sos/${id}/resolve`,
      { status, note }
    );
    return data.data.alert;
  },
};
