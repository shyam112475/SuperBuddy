import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository';
import { tokenRepository } from '../repositories/token.repository';
import { signAccessToken } from '../utils/jwt';
import { generateOpaqueToken, hashToken } from '../utils/crypto';
import { toPublicUser } from '../utils/serializers';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/AppError';
import { logger } from '../config/logger';
import {
  BCRYPT_SALT_ROUNDS,
  PASSWORD_RESET_TOKEN_TTL_MINUTES,
} from '../constants/auth.constants';
import { env } from '../config/env';
import type { RegisterInput, LoginInput } from '../validators/auth.validators';
import type { PublicUser } from '../types/auth.types';

function refreshTokenExpiryDate(): Date {
  const days = env.JWT_REFRESH_EXPIRES_IN_DAYS;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function issueTokenPair(userId: string, role: PublicUser['role'], ip?: string) {
  const accessToken = signAccessToken({ sub: userId, role });

  const rawRefreshToken = generateOpaqueToken();
  await tokenRepository.createRefreshToken({
    userId,
    tokenHash: hashToken(rawRefreshToken),
    expiresAt: refreshTokenExpiryDate(),
    createdByIp: ip,
  });

  return { accessToken, refreshToken: rawRefreshToken };
}

export const authService = {
  async register(input: RegisterInput, ip?: string) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      phoneNumber: input.phoneNumber,
      gender: input.gender,
      dateOfBirth: input.dateOfBirth,
    });

    const tokens = await issueTokenPair(user.id, user.role, ip);
    logger.info({ userId: user.id }, 'User registered');

    return { user: toPublicUser(user), ...tokens };
  },

  async login(input: LoginInput, ip?: string) {
    const user = await userRepository.findByEmail(input.email);

    // Same error for "no such user" and "wrong password" — don't leak
    // which one it was, that's a user-enumeration vector.
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('This account has been deactivated');
    }

    const tokens = await issueTokenPair(user.id, user.role, ip);
    logger.info({ userId: user.id }, 'User logged in');

    return { user: toPublicUser(user), ...tokens };
  },

  /**
   * Rotates a refresh token: the presented token is revoked and a brand new
   * pair is issued. If a token that's already revoked is presented, that's
   * a signal of possible token theft/replay, so we revoke the whole family
   * for that user as a precaution.
   */
  async refresh(rawRefreshToken: string, ip?: string) {
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await tokenRepository.findRefreshTokenByHash(tokenHash);

    if (!stored) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (stored.revokedAt) {
      logger.warn({ userId: stored.userId }, 'Reuse of revoked refresh token detected — revoking all sessions');
      await tokenRepository.revokeAllForUser(stored.userId);
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token has expired, please log in again');
    }

    const user = await userRepository.findById(stored.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Account no longer available');
    }

    const newRawToken = generateOpaqueToken();
    const newStored = await tokenRepository.createRefreshToken({
      userId: user.id,
      tokenHash: hashToken(newRawToken),
      expiresAt: refreshTokenExpiryDate(),
      createdByIp: ip,
    });
    await tokenRepository.revokeRefreshToken(stored.id, newStored.id);

    const accessToken = signAccessToken({ sub: user.id, role: user.role });

    return { user: toPublicUser(user), accessToken, refreshToken: newRawToken };
  },

  async logout(rawRefreshToken: string) {
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await tokenRepository.findRefreshTokenByHash(tokenHash);

    // Logging out with an already-invalid token is a no-op, not an error —
    // the end state the caller wants (being logged out) is already true.
    if (stored && !stored.revokedAt) {
      await tokenRepository.revokeRefreshToken(stored.id);
    }
  },

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);

    // Always behave the same way whether or not the email exists,
    // so this endpoint can't be used to enumerate registered accounts.
    if (!user) {
      logger.info({ email }, 'Password reset requested for unknown email');
      return;
    }

    const rawToken = generateOpaqueToken();
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await tokenRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt,
    });

    // Phase 11 / email-provider integration sends this via a real email
    // abstraction. For now, log it so the flow is testable end-to-end locally.
    logger.info(
      { userId: user.id, resetToken: rawToken },
      'Password reset token generated (dev mode — would be emailed in production)'
    );
  },

  async resetPassword(rawToken: string, newPassword: string) {
    const tokenHash = hashToken(rawToken);
    const stored = await tokenRepository.findPasswordResetTokenByHash(tokenHash);

    if (!stored || stored.usedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('This password reset link is invalid or has expired');
    }

    const user = await userRepository.findById(stored.userId);
    if (!user) {
      throw new NotFoundError('Account not found');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await userRepository.updatePassword(user.id, passwordHash);
    await tokenRepository.markPasswordResetTokenUsed(stored.id);

    // Resetting the password invalidates all existing sessions —
    // if an attacker had a valid session, this cuts it off.
    await tokenRepository.revokeAllForUser(user.id);

    logger.info({ userId: user.id }, 'Password reset completed');
  },

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return toPublicUser(user);
  },
};
