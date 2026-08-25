import { NavLink, Outlet } from 'react-router-dom';

const TABS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/partners', label: 'Partners' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/sos', label: 'SOS Alerts' },
  { to: '/admin/reports', label: 'Reports' },
];

const ICONS: Record<string, React.ReactNode> = {
  Dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),

  Users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
  ),

  Partners: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 21a7 7 0 0114 0"
      />
    </svg>
  ),

  Bookings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),

  Payments: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" d="M3 10h18M7 15h3" />
    </svg>
  ),

  'SOS Alerts': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.3 3.5L2.4 17a2 2 0 001.73 3h15.74a2 2 0 001.73-3L13.7 3.5a2 2 0 00-3.4 0z"
      />
      <path strokeLinecap="round" d="M12 9v4M12 16h.01" />
    </svg>
  ),

  Reports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2z"
      />
      <path strokeLinecap="round" d="M14 2v6h6M8 13h8M8 17h6" />
    </svg>
  ),
};

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto flex max-w-[1440px]">
        {/* Sidebar */}
        <aside className="hidden min-h-screen w-64 shrink-0 border-r border-neutral-200 bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            {/* Brand */}
            <div className="flex h-20 items-center border-b border-neutral-100 px-6">
              <div>
                <p className="text-lg font-bold tracking-tight text-neutral-900">
                  Admin Panel
                </p>
                <p className="text-xs text-neutral-400">
                  Management Console
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-6">
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Overview
              </p>

              {TABS.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? 'bg-brand-100 text-brand-600'
                            : 'bg-transparent text-neutral-400 group-hover:text-neutral-600'
                        }`}
                      >
                        <span className="h-5 w-5">
                          {ICONS[tab.label]}
                        </span>
                      </span>

                      <span>{tab.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom */}
            <div className="border-t border-neutral-100 p-4">
              <div className="rounded-xl bg-neutral-50 p-3">
                <p className="text-xs font-medium text-neutral-700">
                  Admin workspace
                </p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  Manage your platform
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Mobile Header */}
          <div className="border-b border-neutral-200 bg-white px-4 py-4 lg:hidden">
            <h1 className="text-lg font-bold text-neutral-900">
              Admin Panel
            </h1>

            <nav className="mt-4 flex gap-1 overflow-x-auto pb-1">
              {TABS.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}