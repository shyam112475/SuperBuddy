import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type { CreateReviewPayload, Review, ReviewListResult } from './types';

export const reviewsApi = {
  async create(payload: CreateReviewPayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<{ review: Review }>>(
      '/reviews',
      payload
    );
    return data.data.review;
  },

  async listForPartner(partnerId: string, page = 1) {
    const { data } = await apiClient.get<ApiSuccessResponse<ReviewListResult>>(
      `/partners/${partnerId}/reviews`,
      { params: { page } }
    );
    return data.data;
  },
};
