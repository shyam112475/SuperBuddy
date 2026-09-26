import { z } from 'zod';

export const createBookingFormSchema = z
  .object({
    activityDescription: z
      .string()
      .trim()
      .min(10, 'Tell the partner a bit more (at least 10 characters)')
      .max(1000),
    date: z.string().min(1, 'Pick a date'),
    startTime: z.string().min(1, 'Pick a start time'),
    endTime: z.string().min(1, 'Pick an end time'),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });
export type CreateBookingFormValues = z.infer<typeof createBookingFormSchema>;
