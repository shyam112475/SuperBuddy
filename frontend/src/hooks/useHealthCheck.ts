import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { ApiSuccessResponse, HealthStatus } from '../types/api';

async function fetchHealth(): Promise<ApiSuccessResponse<HealthStatus>> {
  const { data } = await apiClient.get<ApiSuccessResponse<HealthStatus>>('/health');
  return data;
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
