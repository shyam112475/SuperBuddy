import { z } from 'zod';

export const listNotificationsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
    unreadOnly: z.coerce.boolean().optional(),
  }),
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>['query'];
