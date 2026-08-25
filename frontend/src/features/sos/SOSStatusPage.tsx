import { useParams, Link } from 'react-router-dom';
import { useResolveSOS, useSOSAlert } from './hooks';

export function SOSStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { data: alert, isLoading, isError } = useSOSAlert(id);
  const { mutate: resolve, isPending } = useResolveSOS();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-neutral-50">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="h-6 w-48 rounded bg-neutral-200" />
            <div className="mt-3 h-4 w-80 rounded bg-neutral-200" />
            <div className="mt-8 space-y-3">
              <div className="h-12 rounded bg-neutral-100" />
              <div className="h-12 rounded bg-neutral-100" />
              <div className="h-12 rounded bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !alert) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-neutral-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-xl text-neutral-500">
            ?
          </div>

          <h1 className="mt-4 text-lg font-semibold text-neutral-900">
            SOS alert not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            This alert may no longer exist or you may not have permission
            to view it.
          </p>

          <Link
            to="/bookings"
            className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const isActive = alert.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-6 py-10">
        {/* Back */}
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
        >
          <span className="text-lg">←</span>
          Back to bookings
        </Link>

        {/* Main Card */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* Status Header */}
          <div
            className={`px-6 py-6 ${
              isActive
                ? 'border-b border-red-100 bg-red-50'
                : 'border-b border-green-100 bg-green-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  isActive
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {isActive ? (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v4"
                    />
                    <path
                      strokeLinecap="round"
                      d="M12 16.5h.01"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l9 18H3L12 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12l4 4L19 6"
                    />
                  </svg>
                )}
              </div>

              <div>
                <h1
                  className={`text-xl font-bold ${
                    isActive
                      ? 'text-red-800'
                      : 'text-green-800'
                  }`}
                >
                  {isActive
                    ? 'SOS Alert Active'
                    : 'SOS Alert Resolved'}
                </h1>

                <p
                  className={`mt-1 text-sm leading-6 ${
                    isActive
                      ? 'text-red-700'
                      : 'text-green-700'
                  }`}
                >
                  {isActive
                    ? 'SuperBuddy admins have been notified with your current location.'
                    : `This alert has been marked as ${
                        alert.status === 'FALSE_ALARM'
                          ? 'a false alarm'
                          : 'resolved'
                      }.`}
                </p>
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-white/70 px-3 py-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                </span>

                <span className="text-xs font-semibold text-red-700">
                  Emergency alert is currently active
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Alert details
            </h2>

            <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
              {/* Location */}
              <div className="flex items-start gap-4 border-b border-neutral-100 px-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12z"
                    />
                    <circle cx="12" cy="9" r="2.2" />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-medium text-neutral-400">
                    Current location
                  </p>

                  <p className="mt-1 font-mono text-sm font-medium text-neutral-800">
                    {alert.latitude.toFixed(5)},{' '}
                    {alert.longitude.toFixed(5)}
                  </p>
                </div>
              </div>

              {/* Description */}
              {alert.description && (
                <div className="flex items-start gap-4 border-b border-neutral-100 px-4 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 8h10M7 12h7M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-neutral-400">
                      Description
                    </p>

                    <p className="mt-1 text-sm leading-6 text-neutral-700">
                      {alert.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Triggered */}
              <div className="flex items-start gap-4 border-b border-neutral-100 px-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      d="M12 7v5l3 2"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-medium text-neutral-400">
                    Triggered
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-800">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Resolved */}
              {alert.resolvedAt && (
                <div className="flex items-start gap-4 border-b border-neutral-100 px-4 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12l4 4L19 6"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-neutral-400">
                      Resolved
                    </p>

                    <p className="mt-1 text-sm font-medium text-neutral-800">
                      {new Date(alert.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Resolution note */}
              {alert.resolutionNote && (
                <div className="flex items-start gap-4 px-4 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 9h8M8 13h5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-neutral-400">
                      Resolution note
                    </p>

                    <p className="mt-1 text-sm leading-6 text-neutral-700">
                      {alert.resolutionNote}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {isActive && (
              <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-sm font-semibold text-neutral-800">
                  Are you safe now?
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  If the situation has been resolved, you can close this
                  alert. If this was triggered accidentally, mark it as a
                  false alarm.
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      resolve({
                        id: alert.id,
                        status: 'RESOLVED',
                      })
                    }
                    disabled={isPending}
                    className="rounded-lg bg-green-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending
                      ? 'Updating…'
                      : "I'm safe — mark resolved"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      resolve({
                        id: alert.id,
                        status: 'FALSE_ALARM',
                      })
                    }
                    disabled={isPending}
                    className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    This was a false alarm
                  </button>
                </div>
              </div>
            )}

            {/* Safety note */}
            <div className="mt-6 border-t border-neutral-100 pt-5">
              <p className="text-center text-[11px] leading-5 text-neutral-400">
                SuperBuddy SOS is an in-platform safety feature. If
                you are in immediate physical danger, contact local
                emergency services as well.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}