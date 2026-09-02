import { useState } from 'react';
import { usePaymentHistory } from './hooks';
import type { PaymentStatus } from './types';

const STATUS_STYLES: Record<PaymentStatus, string> = {
  CREATED: 'bg-amber-50 text-amber-700',
  PAID: 'bg-green-50 text-green-700',
  FAILED: 'bg-red-50 text-red-700',
  REFUNDED: 'bg-neutral-100 text-neutral-600',
};

export function PaymentHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePaymentHistory(page);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Payment History</h1>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
        {isError && <p className="text-sm text-red-600">Couldn't load payment history.</p>}
        {data && data.items.length === 0 && (
          <p className="text-sm text-neutral-500">No payments yet.</p>
        )}

        {data?.items.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div>
              <p className="font-medium text-neutral-900">
                ₹{payment.amount.toFixed(2)} {payment.currency}
              </p>
              <p className="text-xs text-neutral-500">
                {new Date(payment.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              {payment.status === 'FAILED' && payment.failureReason && (
                <p className="mt-1 text-xs text-red-500">{payment.failureReason}</p>
              )}
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[payment.status]}`}
            >
              {payment.status}
            </span>
          </div>
        ))}
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
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
