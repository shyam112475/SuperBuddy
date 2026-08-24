import { useMutation, useQuery } from '@tanstack/react-query';
import { sosApi } from './sosApi';
import type { CreateSOSAlertPayload } from './types';

export function useTriggerSOS() {
  return useMutation({
    mutationFn: (payload: CreateSOSAlertPayload) => sosApi.create(payload),
  });
}

export function useSOSAlert(id: string | undefined) {
  return useQuery({
    queryKey: ['sos', id],
    queryFn: () => sosApi.getById(id!),
    enabled: Boolean(id),
    // Poll while the page is open — an active alert is exactly the kind of
    // thing you want to see update without a manual refresh.
    refetchInterval: (query) => (query.state.data?.status === 'ACTIVE' ? 5000 : false),
  });
}

export function useResolveSOS() {
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: 'RESOLVED' | 'FALSE_ALARM'; note?: string }) =>
      sosApi.resolve(id, status, note),
  });
}
