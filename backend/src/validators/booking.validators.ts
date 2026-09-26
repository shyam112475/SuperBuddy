import { z } from 'zod';

const MAX_BOOKING_DURATION_HOURS = 12;

export const createBookingSchema = z.object({
  body: z
    .object({
      partnerProfileId: z.string().uuid('Invalid partner'),
      offeringId: z.string().uuid('Invalid service'),
      activityDescription: z
        .string()
        .trim()
        .min(10, 'Tell the partner a bit more about the activity (at least 10 characters)')
        .max(1000),
      scheduledStart: z.coerce.date(),
      scheduledEnd: z.coerce.date(),
    })
    .refine((data) => data.scheduledStart.getTime() > Date.now(), {
      message: 'scheduledStart must be in the future',
      path: ['scheduledStart'],
    })
    .refine((data) => data.scheduledEnd > data.scheduledStart, {
      message: 'scheduledEnd must be after scheduledStart',
      path: ['scheduledEnd'],
    })
    .refine(
      (data) =>
        data.scheduledEnd.getTime() - data.scheduledStart.getTime() <=
        MAX_BOOKING_DURATION_HOURS * 60 * 60 * 1000,
      {
        message: `A single booking can't be longer than ${MAX_BOOKING_DURATION_HOURS} hours`,
        path: ['scheduledEnd'],
      }
    ),
});

export const rejectBookingSchema = z.object({
  body: z.object({
    reason: z.string().trim().max(500).optional(),
  }),
});

export const cancelBookingSchema = z.object({
  body: z.object({
    reason: z.string().trim().max(500).optional(),
  }),
});

export const listBookingsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
    as: z.enum(['customer', 'partner']).optional(),
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED']).optional(),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
export type RejectBookingInput = z.infer<typeof rejectBookingSchema>['body'];
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>['body'];
export type ListBookingsQuery = z.infer<typeof listBookingsQuerySchema>['query'];
