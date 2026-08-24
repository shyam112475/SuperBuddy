import type { PublicUser } from '../auth/types';

export type { PublicUser };

export interface UpdateProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
