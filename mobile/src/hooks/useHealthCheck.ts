import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import type { ApiSuccessResponse } from '@/types/api';

interface HealthStatus {
  status: 'healthy';
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessResponse<HealthStatus>>('/health');
      return data;
    },
    retry: 1,
  });
}
