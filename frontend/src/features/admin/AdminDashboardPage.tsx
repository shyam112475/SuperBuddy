import { useAdminDashboard } from './hooks';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) return <p className="text-sm text-neutral-500">Loading…</p>;
  if (isError || !data) return <p className="text-sm text-red-600">Couldn't load dashboard stats.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Users</h2>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Total users" value={data.users.total} />
          <StatCard label="Partners" value={data.users.partners} />
          <StatCard label="Admins" value={data.users.admins} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Bookings by status
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(data.bookings).map(([status, count]) => (
            <StatCard key={status} label={status} value={count} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Revenue</h2>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard
            label="Total collected"
            value={`₹${data.revenue.totalPaid.toFixed(2)}`}
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Safety</h2>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Active SOS alerts" value={data.safety.activeSOSAlerts} />
          <StatCard label="Open reports" value={data.safety.openReports} />
        </div>
      </div>
    </div>
  );
}
