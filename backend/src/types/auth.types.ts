import type { UserRole } from '@prisma/client';

/** Payload encoded into the short-lived JWT access token. */
export interface AccessTokenPayload {
  sub: string; // user id
  role: UserRole;
  tokenVersion?: number;
}

/** Public-safe user shape returned to clients — never includes passwordHash. */
export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  gender: string | null;
  dateOfBirth: Date | null;
  profileImage: string | null;
  verificationStatus: string;
  isActive: boolean;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
}
