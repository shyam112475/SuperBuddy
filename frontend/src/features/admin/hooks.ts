import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from './adminApi';

export function useAdminDashboard() {
  return useQuery({ queryKey: ['admin', 'dashboard'], queryFn: () => adminApi.getDashboard() });
}

export function useAdminUsers(params: { page?: number; search?: string; role?: string }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.listUsers(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminPartners(params: { page?: number; verificationStatus?: string }) {
  return useQuery({
    queryKey: ['admin', 'partners', params],
    queryFn: () => adminApi.listPartners(params),
    placeholderData: (prev) => prev,
  });
}

export function useVerifyPartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ partnerId, status, note }: { partnerId: string; status: 'VERIFIED' | 'REJECTED'; note?: string }) =>
      adminApi.verifyPartner(partnerId, status, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] }),
  });
}

export function useAdminBookings(params: { page?: number; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'bookings', params],
    queryFn: () => adminApi.listBookings(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminPayments(params: { page?: number; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: () => adminApi.listPayments(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminSOSAlerts(params: { page?: number; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'sos', params],
    queryFn: () => adminApi.listSOSAlerts(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminReports(params: { page?: number; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'reports', params],
    queryFn: () => adminApi.listReports(params),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportId,
      status,
      note,
    }: {
      reportId: string;
      status: 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
      note?: string;
    }) => adminApi.updateReportStatus(reportId, status, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] }),
  });
}
