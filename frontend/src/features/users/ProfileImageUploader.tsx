import { useRef, useState } from 'react';
import { useUploadProfileImage } from './hooks';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ProfileImageUploader({
  currentImageUrl,
  fullName,
}: {
  currentImageUrl: string | null;
  fullName: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const { mutate, isPending, error } = useUploadProfileImage();

  const initials = fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError('Please choose a JPEG, PNG, or WebP image');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setLocalError('Image must be 5MB or smaller');
      return;
    }

    setLocalError(null);
    mutate(file);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 overflow-hidden rounded-full bg-brand-100 text-brand-700">
        {currentImageUrl ? (
          <img src={currentImageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-semibold">
            {initials}
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
        >
          {isPending ? 'Uploading…' : 'Change photo'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={handleFileChange}
        />
        {(localError || error) && (
          <p className="mt-1 text-xs text-red-600">
            {localError || 'Upload failed. Please try again.'}
          </p>
        )}
      </div>
    </div>
  );
}
