import { useState } from 'react';
import { StarRating } from '../../components/StarRating';
import { usePartnerReviews } from './hooks';

export function ReviewList({ partnerId }: { partnerId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePartnerReviews(partnerId, page);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-neutral-200" />
              <div className="h-3 w-20 rounded bg-neutral-200" />
            </div>

            <div className="mt-3 h-4 w-24 rounded bg-neutral-200" />
            <div className="mt-3 h-3 w-full rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-4/5 rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
          ★
        </div>

        <h3 className="mt-4 text-sm font-semibold text-neutral-900">
          No reviews yet
        </h3>

        <p className="mt-1 text-sm text-neutral-500">
          Reviews from completed bookings will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {data.items.map((review) => (
          <article
            key={review.id}
            className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {review.reviewer.fullName
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-900">
                    {review.reviewer.fullName}
                  </p>

                  <p className="mt-0.5 text-xs text-neutral-400">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1">
                <div className="flex items-center gap-1.5">
                  <StarRating value={review.rating} size="sm" />
                  <span className="text-xs font-semibold text-amber-700">
                    {review.rating}.0
                  </span>
                </div>
              </div>
            </div>

            {review.comment && (
              <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3">
                <p className="text-sm leading-6 text-neutral-700">
                  “{review.comment}”
                </p>
              </div>
            )}
          </article>
        ))}
      </div>

      {data.pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="rounded-lg bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-600">
            {data.pagination.page} / {data.pagination.totalPages}
          </span>

          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}