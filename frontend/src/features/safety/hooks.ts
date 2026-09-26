import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { safetyApi } from './safetyApi';
import type { CreateReportPayload } from './types';

export function useCreateReport() {
  return useMutation({
    mutationFn: (payload: CreateReportPayload) => safetyApi.createReport(payload),
  });
}

export function useMyBlocks() {
  return useQuery({
    queryKey: ['blocks', 'mine'],
    queryFn: () => safetyApi.listMyBlocks(),
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => safetyApi.blockUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blocks'] }),
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => safetyApi.unblockUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blocks'] }),
  });
}
