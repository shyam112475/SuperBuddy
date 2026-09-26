import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z
    .object({
      fullName: z.string().trim().min(2, 'Full name is required').max(100).optional(),
      phoneNumber: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number')
        .or(z.literal(''))
        .optional(),
      gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']).optional(),
      dateOfBirth: z.coerce.date().optional(),
      emergencyContactName: z.string().trim().max(100).optional().or(z.literal('')),
      emergencyContactPhone: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number')
        .optional()
        .or(z.literal('')),
    })
    // Editing your own profile can never change email, password, role, or
    // verification status here — email changes need re-verification and
    // role/verification changes go through dedicated admin/verification
    // flows, not a generic "edit profile" form.
    .strict('Unexpected field in profile update'),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
