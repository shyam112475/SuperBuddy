import { useState } from 'react';
import { useAdminSOSAlerts } from './hooks';

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-red-50 text-red-700 ring-red-600/20',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  FALSE_ALARM: 'bg-neutral-100 text-neutral-600 ring-neutral-500/20',
};

function SOSIcon() {
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

function LocationIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"
      />
      <circle cx="12" cy="10" r="2.5" />
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

export function AdminSOSPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useAdminSOSAlerts({
    page,
    status: status || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <SOSIcon />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                SOS Alerts
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Monitor emergency alerts and safety events.
              </p>
            </div>
          </div>
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
            <option value="ACTIVE">Active</option>
            <option value="RESOLVED">Resolved</option>
            <option value="FALSE_ALARM">False alarm</option>
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

      {/* Safety Notice */}
      {status === 'ACTIVE' && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
          <div className="mt-0.5 shrink-0 text-red-600">
            <SOSIcon />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-900">
              Active emergency alerts
            </p>

            <p className="mt-1 text-sm text-red-700">
              These alerts may require immediate attention from the
              administration or safety team.
            </p>
          </div>
        </div>
      )}

      {/* Alerts */}
      <div className="space-y-4">
        {isLoading && (
          <>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl border border-neutral-200 bg-white"
              />
            ))}
          </>
        )}

        {!isLoading && data?.items.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <SOSIcon />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-neutral-900">
              No SOS alerts found
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              No alerts match the selected status.
            </p>
          </div>
        )}

        {!isLoading &&
          data?.items.map((alert) => {
            const isActive = alert.status === 'ACTIVE';

            return (
              <div
                key={alert.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                  isActive
                    ? 'border-red-300 shadow-red-100/50'
                    : 'border-neutral-200 hover:shadow-md'
                }`}
              >
                {/* Active Alert Strip */}
                {isActive && (
                  <div className="h-1 bg-red-500" />
                )}

                <div className="p-5 sm:p-6">
                  {/* Top */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isActive
                            ? 'bg-red-100 text-red-600'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        <SOSIcon />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-neutral-900">
                            {alert.triggeredBy.fullName}
                          </h3>

                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                              STATUS_STYLES[alert.status] ??
                              STATUS_STYLES.RESOLVED
                            }`}
                          >
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                            {alert.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                          <span className="flex items-center gap-1.5">
                            <UserIcon />
                            Triggered by user
                          </span>

                          <span className="text-neutral-300">•</span>

                          <span>
                            {new Date(alert.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                        ATTENTION REQUIRED
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        Location
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                        <span className="text-neutral-400">
                          <LocationIcon />
                        </span>

                        <span>
                          {alert.latitude.toFixed(5)},{' '}
                          {alert.longitude.toFixed(5)}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        Alert time
                      </p>

                      <p className="mt-2 text-sm font-medium text-neutral-700">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {alert.description && (
                    <div className="mt-4 rounded-xl border border-neutral-100 bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        Description
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                        {alert.description}
                      </p>
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