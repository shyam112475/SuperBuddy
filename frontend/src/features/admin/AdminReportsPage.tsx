import { useState } from 'react';
import { useAdminReports, useUpdateReportStatus } from './hooks';

export function AdminReportsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('OPEN');
  const { data, isLoading } = useAdminReports({ page, status: status || undefined });
  const { mutate: updateStatus, isPending } = useUpdateReportStatus();
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  return (
    <div>
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="UNDER_REVIEW">Under review</option>
        <option value="RESOLVED">Resolved</option>
        <option value="DISMISSED">Dismissed</option>
      </select>

      <div className="mt-4 space-y-3">
        {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
        {data?.items.length === 0 && (
          <p className="text-sm text-neutral-500">No reports match this filter.</p>
        )}
        {data?.items.map((report) => (
          <div key={report.id} className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-900">
                  <span className="font-medium">{report.reporter.fullName}</span> reported{' '}
                  <span className="font-medium">{report.reportedUser.fullName}</span>
                </p>
                <p className="mt-0.5 text-xs font-medium uppercase text-neutral-500">
                  {report.reason.replace(/_/g, ' ')}
                </p>
                <p className="mt-1 text-sm text-neutral-700">{report.description}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
                {report.resolutionNote && (
                  <p className="mt-2 text-xs text-neutral-500">
                    Resolution: {report.resolutionNote}
                  </p>
                )}
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  report.status === 'OPEN'
                    ? 'bg-amber-50 text-amber-700'
                    : report.status === 'RESOLVED'
                      ? 'bg-green-50 text-green-700'
                      : report.status === 'DISMISSED'
                        ? 'bg-neutral-100 text-neutral-600'
                        : 'bg-blue-50 text-blue-700'
                }`}
              >
                {report.status.replace(/_/g, ' ')}
              </span>
            </div>

            {(report.status === 'OPEN' || report.status === 'UNDER_REVIEW') && (
              <div className="mt-3 border-t border-neutral-100 pt-3">
                <input
                  type="text"
                  placeholder="Resolution note (optional)"
                  value={noteDrafts[report.id] ?? ''}
                  onChange={(e) =>
                    setNoteDrafts((prev) => ({ ...prev, [report.id]: e.target.value }))
                  }
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {report.status === 'OPEN' && (
                    <button
                      onClick={() =>
                        updateStatus({ reportId: report.id, status: 'UNDER_REVIEW', note: noteDrafts[report.id] })
                      }
                      disabled={isPending}
                      className="rounded-md border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                    >
                      Mark under review
                    </button>
                  )}
                  <button
                    onClick={() =>
                      updateStatus({ reportId: report.id, status: 'RESOLVED', note: noteDrafts[report.id] })
                    }
                    disabled={isPending}
                    className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() =>
                      updateStatus({ reportId: report.id, status: 'DISMISSED', note: noteDrafts[report.id] })
                    }
                    disabled={isPending}
                    className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {data && data.pagination.totalPages > 1 && (
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
