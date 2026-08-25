import { useState } from 'react';
import { usePaymentHistory } from './hooks';
import type { PaymentStatus } from './types';

const STATUS_STYLES: Record<PaymentStatus, string> = {
  CREATED: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  PAID: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  FAILED: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  REFUNDED: 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200',
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  CREATED: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

function StatusIcon({ status }: { status: PaymentStatus }) {
  if (status === 'PAID') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
        <svg
          className="h-5 w-5 text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12.5l4 4L19 7.5"
          />
        </svg>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
        <svg
          className="h-5 w-5 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 8v5m0 3h.01" />
        </svg>
      </div>
    );
  }

  if (status === 'REFUNDED') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
        <svg
          className="h-5 w-5 text-neutral-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 7h10m0 0l-3-3m3 3l-3 3M17 17H7m0 0l3-3m-3 3l3 3"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
      <svg
        className="h-5 w-5 text-amber-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 7v5l3 2" />
      </svg>
    </div>
  );
}

export function PaymentHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePaymentHistory(page);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
              <svg
                className="h-5 w-5 text-brand-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path strokeLinecap="round" d="M3 10h18" />
                <path strokeLinecap="round" d="M7 15h3" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                Payment History
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500">
                View your previous payments and transaction status.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-7">
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-neutral-100" />

                    <div className="flex-1">
                      <div className="h-4 w-28 rounded bg-neutral-100" />
                      <div className="mt-2 h-3 w-36 rounded bg-neutral-100" />
                    </div>

                    <div className="h-6 w-16 rounded-full bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-4 w-4 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M12 8v5m0 3h.01" />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-900">
                    Couldn't load payments
                  </p>
                  <p className="mt-1 text-xs text-red-700">
                    Something went wrong while loading your payment history.
                    Please try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && data?.items.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                <svg
                  className="h-6 w-6 text-neutral-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path strokeLinecap="round" d="M3 10h18" />
                </svg>
              </div>

              <h2 className="mt-4 text-sm font-semibold text-neutral-900">
                No payments yet
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-neutral-500">
                Your completed and pending payments will appear here once you
                make a booking.
              </p>
            </div>
          )}

          {/* Payment list */}
          {!isLoading && !isError && data && data.items.length > 0 && (
            <div className="space-y-3">
              {data.items.map((payment) => {
                const date = new Date(payment.createdAt);

                return (
                  <div
                    key={payment.id}
                    className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-neutral-300 hover:shadow"
                  >
                    <div className="flex items-start gap-3">
                      <StatusIcon status={payment.status} />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-base font-semibold text-neutral-900">
                              ₹{payment.amount.toFixed(2)}
                            </p>

                            <p className="mt-0.5 text-xs text-neutral-500">
                              {payment.currency} ·{' '}
                              {date.toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[payment.status]}`}
                          >
                            {STATUS_LABELS[payment.status]}
                          </span>
                        </div>

                        {payment.status === 'FAILED' &&
                          payment.failureReason && (
                            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2">
                              <p className="text-xs leading-5 text-red-700">
                                {payment.failureReason}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="text-xs font-medium text-neutral-500">
              Page{' '}
              <span className="text-neutral-900">
                {data.pagination.page}
              </span>{' '}
              of{' '}
              <span className="text-neutral-900">
                {data.pagination.totalPages}
              </span>
            </span>

            <button
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}