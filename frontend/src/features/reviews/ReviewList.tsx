import { useState } from 'react';
import { StarRating } from '../../components/StarRating';
import { usePartnerReviews } from './hooks';

export function ReviewList({ partnerId }: { partnerId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePartnerReviews(partnerId, page);

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading reviews…</p>;
  }

  if (!data || data.items.length === 0) {
    return <p className="text-sm text-neutral-500">No reviews yet.</p>;
  }

  return (
    <div>
      <div className="space-y-4">
        {data.items.map((review) => (
          <div key={review.id} className="border-b border-neutral-100 pb-4 last:border-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-900">
                {review.reviewer.fullName}
              </span>
              <span className="text-xs text-neutral-400">
                {new Date(review.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="mt-1">
              <StarRating value={review.rating} size="sm" />
            </div>
            {review.comment && (
              <p className="mt-2 text-sm text-neutral-700">{review.comment}</p>
            )}
          </div>
        ))}
      </div>

      {data.pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-neutral-500">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
