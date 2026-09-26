import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid('Invalid booking'),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1, 'Missing order id'),
    razorpayPaymentId: z.string().min(1, 'Missing payment id'),
    razorpaySignature: z.string().min(1, 'Missing signature'),
  }),
});

export const paymentHistoryQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>['body'];
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>['body'];
export type PaymentHistoryQuery = z.infer<typeof paymentHistoryQuerySchema>['query'];
