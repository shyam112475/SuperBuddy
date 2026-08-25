import { useState } from 'react';
import { useAdminUsers } from './hooks';

const ROLE_STYLES: Record<string, string> = {
  USER: 'bg-neutral-100 text-neutral-700 ring-neutral-500/20',
  PARTNER: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  ADMIN: 'bg-blue-50 text-blue-700 ring-blue-600/20',
};

const VERIFICATION_STYLES: Record<string, string> = {
  VERIFIED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  UNVERIFIED: 'bg-neutral-100 text-neutral-600 ring-neutral-500/20',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
};

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-4-4" />
    </svg>
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
      <circle cx="12" cy="8" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 21a7 7 0 0114 0"
      />
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const { data, isLoading } = useAdminUsers({
    page,
    search: search || undefined,
    role: role || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Users
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Manage users, partners, administrators and account status.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <SearchIcon />
            </span>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-sm text-neutral-700 outline-none transition-all placeholder:text-neutral-400 hover:border-neutral-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            />
          </div>

          {/* Role */}
          <div className="relative">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="w-full appearance-none rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 pr-10 text-sm font-medium text-neutral-700 outline-none transition-all hover:border-neutral-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 sm:w-48"
            >
              <option value="">All roles</option>
              <option value="USER">User</option>
              <option value="PARTNER">Partner</option>
              <option value="ADMIN">Admin</option>
            </select>

            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 111.08 1.04l-4.25-4.51a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50/80">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  User
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Role
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Verification
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Account
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {/* Loading */}
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-14">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-brand-500" />

                      <p className="mt-3 text-sm text-neutral-500">
                        Loading users...
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Users */}
              {!isLoading &&
                data?.items.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-neutral-50/70"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-600">
                          {getInitials(user.fullName) || <UserIcon />}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-neutral-900">
                            {user.fullName}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-neutral-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                          ROLE_STYLES[user.role] ??
                          'bg-neutral-100 text-neutral-600 ring-neutral-500/20'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Verification */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                          VERIFICATION_STYLES[user.verificationStatus] ??
                          'bg-neutral-100 text-neutral-600 ring-neutral-500/20'
                        }`}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                        {user.verificationStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Active */}
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500">
                          <span className="h-2 w-2 rounded-full bg-neutral-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

              {/* Empty */}
              {!isLoading && data?.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-14">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                        <UserIcon />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-neutral-900">
                        No users found
                      </h3>

                      <p className="mt-1 text-sm text-neutral-500">
                        Try changing your search or role filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t border-neutral-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
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
    </div>
  );
}