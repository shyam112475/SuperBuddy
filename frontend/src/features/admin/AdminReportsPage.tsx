import { useState } from 'react';
import { useAdminReports, useUpdateReportStatus } from './hooks';

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  UNDER_REVIEW: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  DISMISSED: 'bg-neutral-100 text-neutral-600 ring-neutral-500/20',
};

function ReportIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2z"
      />
      <path strokeLinecap="round" d="M14 2v6h6M8 13h8M8 17h6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.3 3.5L2.4 17a2 2 0 001.73 3h15.74a2 2 0 001.73-3L13.7 3.5a2 2 0 00-3.4 0z"
      />
      <path strokeLinecap="round" d="M12 9v4M12 16h.01" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-4 w-4"
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
  );
}

export function AdminReportsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('OPEN');

  const { data, isLoading } = useAdminReports({
    page,
    status: status || undefined,
  });

  const { mutate: updateStatus, isPending } = useUpdateReportStatus();

  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Review user reports and manage moderation cases.
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
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>

          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25-4.51a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Reports */}
      <div className="space-y-4">
        {isLoading && (
          <>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-neutral-200 bg-white"
              />
            ))}
          </>
        )}

        {!isLoading && data?.items.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <ReportIcon />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-neutral-900">
              No reports found
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              No reports match the selected status.
            </p>
          </div>
        )}

        {!isLoading &&
          data?.items.map((report) => {
            const isActionable =
              report.status === 'OPEN' ||
              report.status === 'UNDER_REVIEW';

            return (
              <div
                key={report.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Report Header */}
                <div className="border-b border-neutral-100 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          report.status === 'OPEN'
                            ? 'bg-amber-50 text-amber-600'
                            : report.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-600'
                              : report.status === 'DISMISSED'
                                ? 'bg-neutral-100 text-neutral-500'
                                : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {report.status === 'OPEN' ? (
                          <AlertIcon />
                        ) : (
                          <ReportIcon />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-neutral-900">
                            User Report
                          </h3>

                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                              STATUS_STYLES[report.status] ??
                              STATUS_STYLES.DISMISSED
                            }`}
                          >
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                            {report.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-neutral-400">
                          {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-lg bg-neutral-50 px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500">
                      {report.reason.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Report Body */}
                <div className="px-5 py-5 sm:px-6">
                  {/* Users */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        Reported by
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm">
                          <UserIcon />
                        </div>

                        <p className="text-sm font-medium text-neutral-900">
                          {report.reporter.fullName}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        Reported user
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm">
                          <UserIcon />
                        </div>

                        <p className="text-sm font-medium text-neutral-900">
                          {report.reportedUser.fullName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4 rounded-xl border border-neutral-100 bg-white">
                    <div className="border-b border-neutral-100 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Description
                      </p>
                    </div>

                    <div className="px-4 py-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  {/* Resolution */}
                  {report.resolutionNote && (
                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        Resolution note
                      </p>

                      <p className="mt-1 text-sm leading-6 text-emerald-900">
                        {report.resolutionNote}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {isActionable && (
                    <div className="mt-5 border-t border-neutral-100 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Moderation action
                      </p>

                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Add a resolution note (optional)"
                          value={noteDrafts[report.id] ?? ''}
                          onChange={(e) =>
                            setNoteDrafts((prev) => ({
                              ...prev,
                              [report.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-sm outline-none placeholder:text-neutral-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                        />

                        <div className="mt-3 flex flex-wrap gap-2">
                          {report.status === 'OPEN' && (
                            <button
                              onClick={() =>
                                updateStatus({
                                  reportId: report.id,
                                  status: 'UNDER_REVIEW',
                                  note: noteDrafts[report.id],
                                })
                              }
                              disabled={isPending}
                              className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isPending
                                ? 'Updating...'
                                : 'Mark under review'}
                            </button>
                          )}

                          <button
                            onClick={() =>
                              updateStatus({
                                reportId: report.id,
                                status: 'RESOLVED',
                                note: noteDrafts[report.id],
                              })
                            }
                            disabled={isPending}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isPending ? 'Updating...' : 'Resolve'}
                          </button>

                          <button
                            onClick={() =>
                              updateStatus({
                                reportId: report.id,
                                status: 'DISMISSED',
                                note: noteDrafts[report.id],
                              })
                            }
                            disabled={isPending}
                            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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