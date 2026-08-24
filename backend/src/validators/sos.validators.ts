import { z } from 'zod';

export const createSOSAlertSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid().optional(),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    description: z.string().trim().max(1000).optional(),
  }),
});

export const resolveSOSAlertSchema = z.object({
  body: z.object({
    status: z.enum(['RESOLVED', 'FALSE_ALARM']),
    note: z.string().trim().max(1000).optional(),
  }),
});

export type CreateSOSAlertInput = z.infer<typeof createSOSAlertSchema>['body'];
export type ResolveSOSAlertInput = z.infer<typeof resolveSOSAlertSchema>['body'];
