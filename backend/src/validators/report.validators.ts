import { z } from 'zod';

const REPORT_REASONS = [
  'HARASSMENT',
  'INAPPROPRIATE_CONTENT',
  'SAFETY_CONCERN',
  'FRAUD',
  'SPAM',
  'SEXUAL_SOLICITATION',
  'OTHER',
] as const;

export const createReportSchema = z.object({
  body: z.object({
    reportedUserId: z.string().uuid(),
    bookingId: z.string().uuid().optional(),
    reason: z.enum(REPORT_REASONS),
    description: z
      .string()
      .trim()
      .min(10, 'Please give a bit more detail (at least 10 characters)')
      .max(2000),
  }),
});

export type CreateReportInput = z.infer<typeof createReportSchema>['body'];
