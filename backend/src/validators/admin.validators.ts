import { z } from 'zod';

const pageLimit = {
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
};

export const adminListUsersQuerySchema = z.object({
  query: z.object({
    ...pageLimit,
    search: z.string().trim().min(1).max(100).optional(),
    role: z.enum(['USER', 'PARTNER', 'ADMIN']).optional(),
    verificationStatus: z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']).optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

export const adminListPartnersQuerySchema = z.object({
  query: z.object({
    ...pageLimit,
    verificationStatus: z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']).optional(),
    city: z.string().trim().min(1).max(100).optional(),
  }),
});

export const verifyPartnerSchema = z.object({
  body: z.object({
    status: z.enum(['VERIFIED', 'REJECTED']),
    note: z.string().trim().max(500).optional(),
  }),
});

export const adminListBookingsQuerySchema = z.object({
  query: z.object({
    ...pageLimit,
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED']).optional(),
  }),
});

export const adminListPaymentsQuerySchema = z.object({
  query: z.object({
    ...pageLimit,
    status: z.enum(['CREATED', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  }),
});

export const adminListSOSQuerySchema = z.object({
  query: z.object({
    ...pageLimit,
    status: z.enum(['ACTIVE', 'RESOLVED', 'FALSE_ALARM']).optional(),
  }),
});

export const adminListReportsQuerySchema = z.object({
  query: z.object({
    ...pageLimit,
    status: z.enum(['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED']).optional(),
  }),
});

export const updateReportStatusSchema = z.object({
  body: z.object({
    status: z.enum(['UNDER_REVIEW', 'RESOLVED', 'DISMISSED']),
    note: z.string().trim().max(500).optional(),
  }),
});

export type AdminListUsersQuery = z.infer<typeof adminListUsersQuerySchema>['query'];
export type AdminListPartnersQuery = z.infer<typeof adminListPartnersQuerySchema>['query'];
export type VerifyPartnerInput = z.infer<typeof verifyPartnerSchema>['body'];
export type AdminListBookingsQuery = z.infer<typeof adminListBookingsQuerySchema>['query'];
export type AdminListPaymentsQuery = z.infer<typeof adminListPaymentsQuerySchema>['query'];
export type AdminListSOSQuery = z.infer<typeof adminListSOSQuerySchema>['query'];
export type AdminListReportsQuery = z.infer<typeof adminListReportsQuerySchema>['query'];
export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>['body'];
