import { useState } from 'react';
import { StarRating } from '../../components/StarRating';
import { useCreateReview } from './hooks';
import type { AxiosError } from 'axios';

export function WriteReviewForm({ bookingId, partnerName }: { bookingId: string; partnerName: string }) {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { mutate, isPending, isSuccess, error } = useCreateReview();

  const apiError = error as AxiosError<{ message: string }> | null;

  if (isSuccess) {
    return <p className="text-xs text-green-600">Thanks for your review!</p>;
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="text-xs font-medium text-brand-600 hover:underline"
      >
        Write a review for {partnerName.split(' ')[0]}
      </button>
    );
  }

  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <label className="block text-xs font-medium text-neutral-700">Your rating</label>
      <div className="mt-1">
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <label className="mt-3 block text-xs font-medium text-neutral-700">
        Comment (optional)
      </label>
      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={`How was your activity with ${partnerName.split(' ')[0]}?`}
        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
      />

      {apiError && (
        <p className="mt-1 text-xs text-red-600">
          {apiError.response?.data?.message || 'Something went wrong. Please try again.'}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => mutate({ bookingId, rating, comment: comment || undefined })}
          disabled={isPending || rating === 0}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {isPending ? 'Submitting…' : 'Submit review'}
        </button>
        <button
          onClick={() => setExpanded(false)}
          disabled={isPending}
          className="text-xs text-neutral-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
