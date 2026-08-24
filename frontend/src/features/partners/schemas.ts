import { z } from 'zod';

export const partnerProfileFormSchema = z.object({
  headline: z.string().trim().min(4, 'Headline is required').max(100),
  bio: z.string().trim().min(20, 'Tell people a bit more (at least 20 characters)').max(2000),
  city: z.string().trim().min(2, 'City is required').max(100),
  area: z.string().trim().max(100).optional().or(z.literal('')),
});
export type PartnerProfileFormValues = z.infer<typeof partnerProfileFormSchema>;

export const addServiceFormSchema = z.object({
  serviceCategoryId: z.string().uuid('Choose a service'),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  pricePerHour: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(Number(v)) && Number(v) > 0), 'Enter a valid price'),
});
export type AddServiceFormValues = z.infer<typeof addServiceFormSchema>;
