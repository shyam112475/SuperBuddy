import { z } from 'zod';

const DAY_OF_WEEK = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] as const;

const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm 24-hour format');

export const createPartnerProfileSchema = z.object({
  body: z.object({
    headline: z.string().trim().min(4, 'Headline is required').max(100),
    bio: z.string().trim().min(20, 'Bio should be at least 20 characters').max(2000),
    city: z.string().trim().min(2, 'City is required').max(100),
    area: z.string().trim().max(100).optional(),
  }),
});

export const updatePartnerProfileSchema = z.object({
  body: z
    .object({
      headline: z.string().trim().min(4).max(100).optional(),
      bio: z.string().trim().min(20).max(2000).optional(),
      city: z.string().trim().min(2).max(100).optional(),
      area: z.string().trim().max(100).optional().or(z.literal('')),
      isAcceptingBookings: z.boolean().optional(),
    })
    .strict('Unexpected field in partner profile update'),
});

export const addServiceOfferingSchema = z.object({
  body: z.object({
    serviceCategoryId: z.string().uuid('Invalid service category'),
    description: z.string().trim().max(500).optional(),
    pricePerHour: z.coerce.number().positive().max(100000).optional(),
  }),
});

export const setAvailabilitySchema = z.object({
  body: z.object({
    // Full weekly schedule replacement — simpler and less error-prone than
    // incremental slot CRUD for a v1 recurring-availability model.
    slots: z
      .array(
        z
          .object({
            dayOfWeek: z.enum(DAY_OF_WEEK),
            startTime: timeString,
            endTime: timeString,
          })
          .refine((slot) => slot.startTime < slot.endTime, {
            message: 'startTime must be before endTime',
            path: ['endTime'],
          })
      )
      .max(50),
  }),
});

export const discoverPartnersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
    city: z.string().trim().min(1).optional(),
    gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']).optional(),
    serviceCategory: z.string().trim().min(1).optional(), // slug
    dayOfWeek: z.enum(DAY_OF_WEEK).optional(),
    search: z.string().trim().min(1).max(100).optional(), // matches headline/bio
  }),
});

export type CreatePartnerProfileInput = z.infer<typeof createPartnerProfileSchema>['body'];
export type UpdatePartnerProfileInput = z.infer<typeof updatePartnerProfileSchema>['body'];
export type AddServiceOfferingInput = z.infer<typeof addServiceOfferingSchema>['body'];
export type SetAvailabilityInput = z.infer<typeof setAvailabilitySchema>['body'];
export type DiscoverPartnersQuery = z.infer<typeof discoverPartnersQuerySchema>['query'];
