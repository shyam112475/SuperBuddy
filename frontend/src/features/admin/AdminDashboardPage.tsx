import { useAdminDashboard } from './hooks';

function StatCard({
  label,
  value,
  icon,
  variant = 'default',
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'default' | 'warning' | 'danger' | 'success';
}) {
  const variants = {
    default: {
      icon: 'bg-neutral-100 text-neutral-600',
      value: 'text-neutral-900',
    },
    warning: {
      icon: 'bg-amber-50 text-amber-600',
      value: 'text-amber-700',
    },
    danger: {
      icon: 'bg-red-50 text-red-600',
      value: 'text-red-700',
    },
    success: {
      icon: 'bg-emerald-50 text-emerald-600',
      value: 'text-emerald-700',
    },
  };

  const style = variants[variant];

  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-500">{label}</p>

          <p
            className={`mt-2 text-2xl font-bold tracking-tight ${style.value}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
    </div>
  );
}

function UserIcon() {
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
        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      />
    </svg>
  );
}

function PartnerIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 21a7 7 0 0114 0"
      />
    </svg>
  );
}

function ShieldIcon() {
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
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function RevenueIcon() {
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
        d="M12 1v22M17 5.5C16.2 4.5 14.8 4 13 4h-2a4 4 0 000 8h2a4 4 0 010 8h-2c-1.8 0-3.2-.5-4-1.5"
      />
    </svg>
  );
}

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-40 animate-pulse rounded-lg bg-neutral-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-neutral-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-neutral-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-sm rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ShieldIcon />
          </div>

          <h2 className="mt-4 font-semibold text-red-900">
            Unable to load dashboard
          </h2>

          <p className="mt-1 text-sm text-red-600">
            Couldn't load dashboard stats. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Overview of your platform activity and performance.
        </p>
      </div>

      {/* Users */}
      <section>
        <SectionHeader
          title="Users"
          description="Overview of registered platform users."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total users"
            value={data.users.total}
            icon={<UserIcon />}
          />

          <StatCard
            label="Partners"
            value={data.users.partners}
            icon={<PartnerIcon />}
          />

          <StatCard
            label="Admins"
            value={data.users.admins}
            icon={<ShieldIcon />}
          />
        </div>
      </section>

      {/* Bookings */}
      <section>
        <SectionHeader
          title="Bookings"
          description="Current booking distribution by status."
        />

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(data.bookings).map(([status, count]) => {
            const variant =
              status === 'COMPLETED'
                ? 'success'
                : status === 'PENDING'
                  ? 'warning'
                  : status === 'REJECTED' || status === 'CANCELLED'
                    ? 'danger'
                    : 'default';

            return (
              <StatCard
                key={status}
                label={status}
                value={count}
                variant={variant}
                icon={<CalendarIcon />}
              />
            );
          })}
        </div>
      </section>

      {/* Revenue */}
      <section>
        <SectionHeader
          title="Revenue"
          description="Payment collection overview."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total collected"
            value={`₹${data.revenue.totalPaid.toFixed(2)}`}
            variant="success"
            icon={<RevenueIcon />}
          />
        </div>
      </section>

      {/* Safety */}
      <section>
        <SectionHeader
          title="Safety"
          description="Important safety and moderation activity."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Active SOS alerts"
            value={data.safety.activeSOSAlerts}
            variant="danger"
            icon={<ShieldIcon />}
          />

          <StatCard
            label="Open reports"
            value={data.safety.openReports}
            variant="warning"
            icon={<ShieldIcon />}
          />
        </div>
      </section>
    </div>
  );
}