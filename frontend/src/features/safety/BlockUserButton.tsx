import { useState } from 'react';
import { useBlockUser } from './hooks';

export function BlockUserButton({ userId }: { userId: string }) {
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending, isSuccess } = useBlockUser();

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
          ✓
        </div>

        <span className="text-xs font-medium text-neutral-600">
          This person has been blocked.
        </span>
      </div>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="12" cy="12" r="8.5" />
          <path
            strokeLinecap="round"
            d="M5.9 5.9l12.2 12.2"
          />
        </svg>

        Block person
      </button>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-4">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
          !
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-900">
            Block this person?
          </p>

          <p className="mt-1 text-xs leading-5 text-red-700">
            They won't be able to message you or make bookings with you.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => mutate(userId)}
              disabled={isPending}
              className="rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Blocking…' : 'Yes, block'}
            </button>

            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={isPending}
              className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}