import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository';
import { tokenRepository } from '../repositories/token.repository';
import { storageProvider } from './storage';
import { toPublicUser } from '../utils/serializers';
import { NotFoundError, UnauthorizedError, ConflictError } from '../utils/AppError';
import { logger } from '../config/logger';
import { BCRYPT_SALT_ROUNDS } from '../constants/auth.constants';
import type { UpdateProfileInput } from '../validators/user.validators';

const PROFILE_IMAGE_FOLDER = 'profile-images';

export const userService = {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundError('User not found');
    }
    return toPublicUser(user);
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundError('User not found');
    }

    try {
      const updated = await userRepository.update(userId, {
        fullName: input.fullName,
        phoneNumber: input.phoneNumber === '' ? null : input.phoneNumber,
        gender: input.gender,
        dateOfBirth: input.dateOfBirth,
        emergencyContactName:
          input.emergencyContactName === '' ? null : input.emergencyContactName,
        emergencyContactPhone:
          input.emergencyContactPhone === '' ? null : input.emergencyContactPhone,
      });
      return toPublicUser(updated);
    } catch (err: unknown) {
      // Prisma unique constraint violation (phone number already in use)
      if (typeof err === 'object' && err && 'code' in err && err.code === 'P2002') {
        throw new ConflictError('That phone number is already in use');
      }
      throw err;
    }
  },

  async updateProfileImage(
    userId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string }
  ) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundError('User not found');
    }

    const uploaded = await storageProvider.uploadImage({
      buffer: file.buffer,
      filename: file.originalname,
      mimetype: file.mimetype,
      folder: PROFILE_IMAGE_FOLDER,
    });

    const updated = await userRepository.updateProfileImage(userId, uploaded.url);
    logger.info({ userId }, 'Profile image updated');
    return toPublicUser(updated);
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundError('User not found');
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await userRepository.updatePassword(userId, passwordHash);

    // Changing the password invalidates every other session — if someone
    // else had a live session (stolen token, shared device), this cuts it off.
    await tokenRepository.revokeAllForUser(userId);
    logger.info({ userId }, 'Password changed');
  },

  async deleteAccount(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundError('User not found');
    }

    await userRepository.softDelete(userId);
    await tokenRepository.revokeAllForUser(userId);
    logger.info({ userId }, 'Account deactivated (soft delete)');
  },
};
