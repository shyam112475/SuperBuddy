import { useState } from 'react';
import { useAdminPartners, useVerifyPartner } from './hooks';

const VERIFICATION_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'UNVERIFIED', label: 'Unverified' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'REJECTED', label: 'Rejected' },
];

const STATUS_STYLES: Record<string, string> = {
  VERIFIED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  UNVERIFIED: 'bg-neutral-100 text-neutral-600 ring-neutral-500/20',
};

export function AdminPartnersPage() {
  const [page, setPage] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState('');

  const { data, isLoading } = useAdminPartners({
    page,
    verificationStatus: verificationStatus || undefined,
  });

  const { mutate: verify, isPending } = useVerifyPartner();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Partners
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Review and manage partner verification status.
          </p>
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            value={verificationStatus}
            onChange={(e) => {
              setVerificationStatus(e.target.value);
              setPage(1);
            }}
            className="w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-neutral-700 shadow-sm outline-none transition-all hover:border-neutral-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:w-48"
          >
            {VERIFICATION_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
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

      {/* Partners */}
      <div className="space-y-4">
        {isLoading && (
          <>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl border border-neutral-200 bg-white"
              />
            ))}
          </>
        )}

        {!isLoading &&
          data?.items.map((partner) => {
            const status = partner.partner.verificationStatus;
            const isVerified = status === 'VERIFIED';

            return (
              <div
                key={partner.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-5">
                  {/* Partner Information */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      {/* Avatar */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
                        {partner.partner.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-neutral-900">
                            {partner.partner.fullName}
                          </h3>

                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                              STATUS_STYLES[status] ??
                              STATUS_STYLES.UNVERIFIED
                            }`}
                          >
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                            {status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-neutral-600">
                          {partner.headline}
                        </p>

                        {/* Contact */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                          <span>{partner.partner.email}</span>

                          {partner.partner.phoneNumber && (
                            <>
                              <span className="text-neutral-300">•</span>
                              <span>{partner.partner.phoneNumber}</span>
                            </>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                          <span className="rounded-lg bg-neutral-50 px-2.5 py-1.5 font-medium text-neutral-600">
                            {partner.city}
                          </span>

                          <span className="rounded-lg bg-neutral-50 px-2.5 py-1.5 font-medium text-neutral-600">
                            {partner.reviewCount} review
                            {partner.reviewCount === 1 ? '' : 's'}
                          </span>

                          {partner.averageRating && (
                            <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 font-semibold text-amber-700">
                              <svg
                                className="h-3.5 w-3.5 fill-current"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path d="M10 1.5l2.472 5.008 5.528.803-4 3.899.944 5.507L10 14.25l-4.944 2.467.944-5.507-4-3.899 5.528-.803z" />
                              </svg>

                              {partner.averageRating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100" />

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {!isVerified && (
                      <>
                        <button
                          onClick={() =>
                            verify({
                              partnerId: partner.id,
                              status: 'VERIFIED',
                            })
                          }
                          disabled={isPending}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-7.5 9.5a.75.75 0 01-1.1.06l-4-4a.75.75 0 011.06-1.06l3.405 3.405 6.97-8.83a.75.75 0 011.022-.127z"
                              clipRule="evenodd"
                            />
                          </svg>

                          {isPending ? 'Updating...' : 'Verify'}
                        </button>

                        <button
                          onClick={() =>
                            verify({
                              partnerId: partner.id,
                              status: 'REJECTED',
                            })
                          }
                          disabled={isPending}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 11-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>

                          {isPending ? 'Updating...' : 'Reject'}
                        </button>
                      </>
                    )}

                    {isVerified && (
                      <button
                        onClick={() =>
                          verify({
                            partnerId: partner.id,
                            status: 'REJECTED',
                          })
                        }
                        disabled={isPending}
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Revoke verification
                      </button>
                    )}

                    <span className="ml-auto text-xs text-neutral-400">
                      Partner ID: {partner.id}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        {/* Empty State */}
        {!isLoading && data?.items.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <svg
                className="h-6 w-6 text-neutral-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="7" r="4" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 21a7 7 0 0114 0"
                />
              </svg>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-neutral-900">
              No partners found
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              No partners match the selected verification status.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            Page{' '}
            <span className="font-semibold text-neutral-900">
              {data.pagination.page}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-neutral-900">
              {data.pagination.totalPages}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}