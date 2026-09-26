import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type { Booking, BookingListResult, CreateBookingPayload, ListBookingsFilters } from './types';

export const bookingsApi = {
  async create(payload: CreateBookingPayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<{ booking: Booking }>>(
      '/bookings',
      payload
    );
    return data.data.booking;
  },

  async list(filters: ListBookingsFilters) {
    const { data } = await apiClient.get<ApiSuccessResponse<BookingListResult>>('/bookings', {
      params: filters,
    });
    return data.data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<ApiSuccessResponse<{ booking: Booking }>>(
      `/bookings/${id}`
    );
    return data.data.booking;
  },

  async accept(id: string) {
    const { data } = await apiClient.patch<ApiSuccessResponse<{ booking: Booking }>>(
      `/bookings/${id}/accept`
    );
    return data.data.booking;
  },

  async reject(id: string, reason?: string) {
    const { data } = await apiClient.patch<ApiSuccessResponse<{ booking: Booking }>>(
      `/bookings/${id}/reject`,
      { reason }
    );
    return data.data.booking;
  },

  async cancel(id: string, reason?: string) {
    const { data } = await apiClient.patch<ApiSuccessResponse<{ booking: Booking }>>(
      `/bookings/${id}/cancel`,
      { reason }
    );
    return data.data.booking;
  },

  async complete(id: string) {
    const { data } = await apiClient.patch<ApiSuccessResponse<{ booking: Booking }>>(
      `/bookings/${id}/complete`
    );
    return data.data.booking;
  },
};
