import multer from 'multer';
import { BadRequestError } from '../utils/AppError';

const ALLOWED_MIMETYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Memory storage — files are validated and streamed straight to the
 * storage provider (Cloudinary/local), never written to disk by multer
 * itself. Size and mimetype are checked here, before anything reaches
 * the storage provider or the database.
 */
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMETYPES.has(file.mimetype)) {
      return cb(new BadRequestError('Only JPEG, PNG, or WebP images are allowed'));
    }
    cb(null, true);
  },
});
