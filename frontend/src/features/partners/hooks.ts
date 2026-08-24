import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { partnersApi } from './partnersApi';
import type {
  AddServiceOfferingPayload,
  AvailabilitySlot,
  CreatePartnerProfilePayload,
  PartnerSearchFilters,
  UpdatePartnerProfilePayload,
} from './types';

export function useSearchPartners(filters: PartnerSearchFilters) {
  return useQuery({
    queryKey: ['partners', 'search', filters],
    queryFn: () => partnersApi.search(filters),
    placeholderData: (prev) => prev, // keeps the old page visible while the next loads
  });
}

export function usePartnerDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['partners', 'detail', id],
    queryFn: () => partnersApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: ['partners', 'categories'],
    queryFn: () => partnersApi.getCategories(),
    staleTime: 5 * 60_000, // admin-managed allowlist, changes rarely
  });
}

export function useMyPartnerProfile() {
  return useQuery({
    queryKey: ['partners', 'me'],
    queryFn: () => partnersApi.getMyProfile(),
    retry: false, // 404 (no profile yet) is an expected, not transient, state
  });
}

export function useCreatePartnerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePartnerProfilePayload) => partnersApi.createProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(['partners', 'me'], profile);
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] }); // role changed to PARTNER
    },
  });
}

export function useUpdatePartnerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePartnerProfilePayload) => partnersApi.updateProfile(payload),
    onSuccess: (profile) => queryClient.setQueryData(['partners', 'me'], profile),
  });
}

export function useAddServiceOffering() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddServiceOfferingPayload) => partnersApi.addServiceOffering(payload),
    onSuccess: (profile) => queryClient.setQueryData(['partners', 'me'], profile),
  });
}

export function useRemoveServiceOffering() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offeringId: string) => partnersApi.removeServiceOffering(offeringId),
    onSuccess: (profile) => queryClient.setQueryData(['partners', 'me'], profile),
  });
}

export function useSetAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slots: AvailabilitySlot[]) => partnersApi.setAvailability(slots),
    onSuccess: (profile) => queryClient.setQueryData(['partners', 'me'], profile),
  });
}
