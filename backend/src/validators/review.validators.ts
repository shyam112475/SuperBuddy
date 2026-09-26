import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid('Invalid booking'),
    rating: z.coerce
      .number()
      .int()
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5'),
    comment: z.string().trim().max(1000).optional(),
  }),
});

export const listPartnerReviewsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
export type ListPartnerReviewsQuery = z.infer<typeof listPartnerReviewsQuerySchema>['query'];
