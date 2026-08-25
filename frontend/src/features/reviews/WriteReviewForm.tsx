import { useState } from 'react';
import { StarRating } from '../../components/StarRating';
import { useCreateReview } from './hooks';
import type { AxiosError } from 'axios';

export function WriteReviewForm({
  bookingId,
  partnerName,
}: {
  bookingId: string;
  partnerName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { mutate, isPending, isSuccess, error } = useCreateReview();

  const apiError = error as AxiosError<{ message: string }> | null;
  const firstName = partnerName.split(' ')[0];

  if (isSuccess) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
          ✓
        </div>

        <div>
          <p className="text-sm font-semibold text-green-800">
            Thanks for your review!
          </p>
          <p className="mt-0.5 text-xs text-green-700">
            Your feedback helps other people choose companions.
          </p>
        </div>
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="group flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left transition hover:border-brand-300 hover:bg-brand-50/30 hover:shadow-sm"
      >
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            How was your experience?
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Leave a review for {firstName}
          </p>
        </div>

        <span className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition group-hover:bg-brand-100">
          Review
        </span>
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-neutral-900">
          Review your experience
        </h3>
        <p className="mt-1 text-xs text-neutral-500">
          How was your activity with {firstName}?
        </p>
      </div>

      <div className="p-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Your rating
          </label>

          <div className="mt-3 flex items-center gap-3">
            <StarRating value={rating} onChange={setRating} size="lg" />

            {rating > 0 && (
              <span className="text-sm font-medium text-neutral-600">
                {rating}/5
              </span>
            )}
          </div>

          {rating === 0 && (
            <p className="mt-2 text-xs text-neutral-400">
              Tap a star to rate your experience
            </p>
          )}
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Comment
            <span className="ml-1 font-normal normal-case text-neutral-400">
              (optional)
            </span>
          </label>

          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Tell us about your experience with ${firstName}…`}
            className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10"
          />

          <div className="mt-1 text-right text-[11px] text-neutral-400">
            {comment.length}/500
          </div>
        </div>

        {apiError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-xs font-medium text-red-700">
              {apiError.response?.data?.message ||
                'Something went wrong. Please try again.'}
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() =>
              mutate({
                bookingId,
                rating,
                comment: comment.trim() || undefined,
              })
            }
            disabled={isPending || rating === 0}
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Submitting…' : 'Submit review'}
          </button>

          <button
            onClick={() => setExpanded(false)}
            disabled={isPending}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}