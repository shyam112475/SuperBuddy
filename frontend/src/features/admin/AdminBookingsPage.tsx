import { useState } from 'react';
import { useAdminBookings } from './hooks';

const STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'];

export function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, isLoading } = useAdminBookings({ page, status: status || undefined });

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
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-2">Activity</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Companion</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Scheduled</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-neutral-500">
                  Loading…
                </td>
              </tr>
            )}
            {data?.items.map((booking) => (
              <tr key={booking.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-2">{booking.serviceCategoryName}</td>
                <td className="px-4 py-2">{booking.customer.fullName}</td>
                <td className="px-4 py-2">{booking.partner.fullName}</td>
                <td className="px-4 py-2">{booking.status}</td>
                <td className="px-4 py-2 text-neutral-500">
                  {new Date(booking.scheduledStart).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
