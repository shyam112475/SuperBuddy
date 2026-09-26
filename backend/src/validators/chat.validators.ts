import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, 'Message cannot be empty').max(2000),
  }),
});

export const listMessagesQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
  }),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>['body'];
export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>['query'];
