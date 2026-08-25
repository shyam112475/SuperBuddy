import { useState } from 'react';
import { useAdminBookings } from './hooks';

const STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'];

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  ACCEPTED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
  CANCELLED: 'bg-neutral-100 text-neutral-600 ring-neutral-500/20',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

export function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, isLoading } = useAdminBookings({
    page,
    status: status || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Bookings
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage and monitor all platform bookings.
          </p>
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-neutral-700 shadow-sm outline-none transition-all hover:border-neutral-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:w-48"
          >
            <option value="">All statuses</option>

            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50/80">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Activity
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Companion
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Scheduled
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {/* Loading */}
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-brand-500" />
                      <p className="mt-3 text-sm text-neutral-500">
                        Loading bookings...
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data */}
              {!isLoading &&
                data?.items.map((booking) => (
                  <tr
                    key={booking.id}
                    className="group transition-colors hover:bg-neutral-50/70"
                  >
                    {/* Activity */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900">
                        {booking.serviceCategoryName}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
                          {booking.customer.fullName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="font-medium text-neutral-700">
                          {booking.customer.fullName}
                        </span>
                      </div>
                    </td>

                    {/* Companion */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">
                          {booking.partner.fullName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="font-medium text-neutral-700">
                          {booking.partner.fullName}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                          STATUS_STYLES[booking.status] ??
                          'bg-neutral-100 text-neutral-600 ring-neutral-500/20'
                        }`}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                        {booking.status}
                      </span>
                    </td>

                    {/* Scheduled */}
                    <td className="px-6 py-4 text-neutral-500">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-neutral-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.75A2.25 2.25 0 0118 6.25v9.5A2.25 2.25 0 0115.75 18h-11A2.25 2.25 0 012.5 15.75v-9.5A2.25 2.25 0 014.75 4h.75V2.75A.75.75 0 015.75 2zM4 8.5v6.75c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75V8.5H4z"
                            clipRule="evenodd"
                          />
                        </svg>

                        {new Date(
                          booking.scheduledStart
                        ).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Empty State */}
              {!isLoading && data?.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-14">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                        <svg
                          className="h-6 w-6 text-neutral-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-neutral-900">
                        No bookings found
                      </h3>

                      <p className="mt-1 text-sm text-neutral-500">
                        There are no bookings matching the selected filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t border-neutral-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-500">
              Page{' '}
              <span className="font-medium text-neutral-900">
                {data.pagination.page}
              </span>{' '}
              of{' '}
              <span className="font-medium text-neutral-900">
                {data.pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}