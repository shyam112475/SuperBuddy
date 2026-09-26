import { z } from 'zod';

export const createBlockSchema = z.object({
  body: z.object({
    blockedUserId: z.string().uuid(),
  }),
});

export type CreateBlockInput = z.infer<typeof createBlockSchema>['body'];
