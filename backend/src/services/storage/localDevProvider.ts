import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { env } from '../../config/env';
import type { StorageProvider, UploadedImage } from './StorageProvider';

/**
 * DEVELOPMENT-ONLY storage provider. Writes files to a local `uploads/`
 * directory instead of a real object store.
 *
 * This exists so the upload flow is testable end-to-end without Cloudinary
 * credentials. It is NOT production-ready: no CDN, no durability guarantees,
 * files vanish on redeploy, and nothing here should be mistaken for the real
 * implementation. Set CLOUDINARY_* env vars to use the real provider instead
 * — see cloudinaryProvider.ts.
 */
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

async function ensureUploadDir(folder: string) {
  const dir = path.join(UPLOAD_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export const localDevStorageProvider: StorageProvider = {
  async uploadImage({ buffer, filename, folder }): Promise<UploadedImage> {
    await ensureUploadDir(folder);
    const ext = path.extname(filename) || '.jpg';
    const publicId = `${folder}/${crypto.randomUUID()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, publicId);

    await fs.writeFile(filePath, buffer);

    return {
      url: `${env.PUBLIC_API_URL}/uploads/${publicId}`,
      publicId,
    };
  },

  async deleteImage(publicId: string): Promise<void> {
    const filePath = path.join(UPLOAD_DIR, publicId);
    await fs.unlink(filePath).catch(() => {
      // Already gone — fine, deletion is idempotent from the caller's view.
    });
  },
};
