import { useState } from 'react';
import { useAdminSOSAlerts } from './hooks';

export function AdminSOSPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, isLoading } = useAdminSOSAlerts({ page, status: status || undefined });

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
        <option value="ACTIVE">Active</option>
        <option value="RESOLVED">Resolved</option>
        <option value="FALSE_ALARM">False alarm</option>
      </select>

      <div className="mt-4 space-y-3">
        {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
        {data?.items.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border p-4 ${
              alert.status === 'ACTIVE' ? 'border-red-300 bg-red-50' : 'border-neutral-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-neutral-900">{alert.triggeredBy.fullName}</p>
                <p className="text-xs text-neutral-500">
                  {alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}
                </p>
                {alert.description && (
                  <p className="mt-1 text-sm text-neutral-700">{alert.description}</p>
                )}
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  alert.status === 'ACTIVE' ? 'bg-red-100 text-red-800' : 'bg-green-50 text-green-700'
                }`}
              >
                {alert.status}
              </span>
            </div>
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
