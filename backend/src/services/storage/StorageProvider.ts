/**
 * Object-storage abstraction for uploaded images (profile photos now;
 * verification documents, activity photos, etc. in later phases).
 * Controllers/services depend on this interface, never on a specific
 * provider, so swapping Cloudinary for S3 (or anything else) later
 * doesn't touch calling code.
 */
export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface StorageProvider {
  uploadImage(params: {
    buffer: Buffer;
    filename: string;
    mimetype: string;
    folder: string;
  }): Promise<UploadedImage>;

  deleteImage(publicId: string): Promise<void>;
}
