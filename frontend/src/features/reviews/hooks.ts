import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from './reviewsApi';
import type { CreateReviewPayload } from './types';

export function usePartnerReviews(partnerId: string | undefined, page = 1) {
  return useQuery({
    queryKey: ['reviews', partnerId, page],
    queryFn: () => reviewsApi.listForPartner(partnerId!, page),
    enabled: Boolean(partnerId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });
}
