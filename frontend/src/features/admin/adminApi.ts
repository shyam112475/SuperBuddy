import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type {
  AdminBooking,
  AdminListResult,
  AdminPartner,
  AdminPayment,
  AdminReport,
  AdminSOSAlert,
  AdminUser,
  DashboardStats,
} from './types';

export const adminApi = {
  async getDashboard() {
    const { data } = await apiClient.get<ApiSuccessResponse<DashboardStats>>('/admin/dashboard');
    return data.data;
  },

  async listUsers(params: { page?: number; search?: string; role?: string }) {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminListResult<AdminUser>>>(
      '/admin/users',
      { params }
    );
    return data.data;
  },

  async listPartners(params: { page?: number; verificationStatus?: string }) {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminListResult<AdminPartner>>>(
      '/admin/partners',
      { params }
    );
    return data.data;
  },

  async verifyPartner(partnerId: string, status: 'VERIFIED' | 'REJECTED', note?: string) {
    await apiClient.patch(`/admin/partners/${partnerId}/verify`, { status, note });
  },

  async listBookings(params: { page?: number; status?: string }) {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminListResult<AdminBooking>>>(
      '/admin/bookings',
      { params }
    );
    return data.data;
  },

  async listPayments(params: { page?: number; status?: string }) {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminListResult<AdminPayment>>>(
      '/admin/payments',
      { params }
    );
    return data.data;
  },

  async listSOSAlerts(params: { page?: number; status?: string }) {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminListResult<AdminSOSAlert>>>(
      '/admin/sos',
      { params }
    );
    return data.data;
  },

  async listReports(params: { page?: number; status?: string }) {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminListResult<AdminReport>>>(
      '/admin/reports',
      { params }
    );
    return data.data;
  },

  async updateReportStatus(
    reportId: string,
    status: 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED',
    note?: string
  ) {
    await apiClient.patch(`/admin/reports/${reportId}/status`, { status, note });
  },
};
