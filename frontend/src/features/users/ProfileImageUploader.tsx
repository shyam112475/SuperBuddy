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
      setLocalError('Please choose a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setLocalError('Image must be 5MB or smaller.');
      return;
    }

    setLocalError(null);
    mutate(file);

    // Allow selecting the same file again
    e.target.value = '';
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
            />
            <circle cx="8.5" cy="10" r="1.5" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16l5-5 4 4 2.5-2.5L21 16"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Profile photo
          </h2>

          <p className="mt-1 text-sm leading-5 text-neutral-500">
            Add a clear photo so people can recognize you easily.
          </p>
        </div>
      </div>

      {/* Upload area */}
      <div className="mt-6 flex items-center gap-5">
        {/* Avatar */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-brand-100 shadow-sm">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-brand-700">
              {initials}
            </div>
          )}

          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
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

          <p className="mt-2 text-xs text-neutral-400">
            JPG, PNG or WebP · Maximum 5MB
          </p>

          {(localError || error) && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-xs font-medium text-red-700">
                {localError || 'Upload failed. Please try again.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}