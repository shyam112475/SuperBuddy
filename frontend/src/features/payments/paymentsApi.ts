import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type { CreateOrderResult, Payment, PaymentListResult } from './types';

export const paymentsApi = {
  async createOrder(bookingId: string) {
    const { data } = await apiClient.post<ApiSuccessResponse<CreateOrderResult>>(
      '/payments/create-order',
      { bookingId }
    );
    return data.data;
  },

  async verify(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const { data } = await apiClient.post<ApiSuccessResponse<{ payment: Payment }>>(
      '/payments/verify',
      params
    );
    return data.data.payment;
  },

  async history(page = 1) {
    const { data } = await apiClient.get<ApiSuccessResponse<PaymentListResult>>(
      '/payments/history',
      { params: { page } }
    );
    return data.data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<ApiSuccessResponse<{ payment: Payment }>>(
      `/payments/${id}`
    );
    return data.data.payment;
  },
};
