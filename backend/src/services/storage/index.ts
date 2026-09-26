import { env } from '../../config/env';
import { logger } from '../../config/logger';
import type { StorageProvider } from './StorageProvider';
import { cloudinaryStorageProvider } from './cloudinaryProvider';
import { localDevStorageProvider } from './localDevProvider';

const cloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
);

if (!cloudinaryConfigured) {
  logger.warn(
    'CLOUDINARY_* env vars not set — using localDevStorageProvider (dev-only, not for production)'
  );
}

export const storageProvider: StorageProvider = cloudinaryConfigured
  ? cloudinaryStorageProvider
  : localDevStorageProvider;
