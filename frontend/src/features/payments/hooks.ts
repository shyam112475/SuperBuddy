import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from './paymentsApi';

export function useCreateOrder() {
  return useMutation({
    mutationFn: (bookingId: string) => paymentsApi.createOrder(bookingId),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }) => paymentsApi.verify(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function usePaymentHistory(page = 1) {
  return useQuery({
    queryKey: ['payments', 'history', page],
    queryFn: () => paymentsApi.history(page),
    placeholderData: (prev) => prev,
  });
}
