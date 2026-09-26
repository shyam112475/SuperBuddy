import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from './bookingsApi';
import type { CreateBookingPayload, ListBookingsFilters } from './types';

export function useListBookings(filters: ListBookingsFilters) {
  return useQuery({
    queryKey: ['bookings', 'list', filters],
    queryFn: () => bookingsApi.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useBookingDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['bookings', 'detail', id],
    queryFn: () => bookingsApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useAcceptBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.accept(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingsApi.reject(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingsApi.cancel(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCompleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.complete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}
