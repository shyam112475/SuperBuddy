import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../features/auth/hooks';
import { NotificationBell } from '../features/notifications/NotificationBell';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

/**
 * Premium Navigation Link Component
 * Desktop: Underline style, Mobile: Pill background style
 */
function NavLink({
  to,
  children,
  mobile = false,
  onClick,
  icon,
}: {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  const location = useLocation();

  const active =
    location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(to));

  if (mobile) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
          active
            ? 'bg-brand-50 text-brand-700 shadow-sm'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        )}
      >
        {icon && <span className="text-base">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        'relative flex items-center gap-2 py-2 text-sm font-medium transition-colors duration-200',
        active ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
      )}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}

      {active && (
        <span className="absolute inset-x-0 -bottom-2 h-1 rounded-full bg-gradient-brand transition-all duration-300" />
      )}
    </Link>
  );
}

function AuthNav({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const { mutate: logout, isPending } = useLogout();

  if (isInitializing) {
    return mobile ? (
      <div className="h-10 animate-pulse rounded-xl bg-neutral-100" />
    ) : (
      <div className="h-8 w-20 animate-pulse rounded-lg bg-neutral-100" />
    );
  }

  /*
   * Logged out
   */
  if (!user) {
    if (mobile) {
      return (
        <div className="border-t border-neutral-100 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/login"
              onClick={onNavigate}
              className="rounded-xl border border-neutral-200 px-4 py-3 text-center text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              onClick={onNavigate}
              className="rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Get started
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
        >
          Sign in
        </Link>

        <Link
          to="/register"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Get started
        </Link>
      </div>
    );
  }

  /*
   * Mobile navigation
   */
  if (mobile) {
    return (
      <div className="space-y-2">
        {/* User */}
        <Link
          to="/profile"
          onClick={onNavigate}
          className="mb-3 flex items-center gap-3 rounded-2xl bg-neutral-50 p-3"
        >
          <UserAvatar
            fullName={user.fullName}
            profileImage={user.profileImage}
          />

          <div className="min-w-0">
            <p className="text-xs text-neutral-400">Welcome back</p>
            <p className="truncate text-sm font-semibold text-neutral-900">
              {user.fullName}
            </p>
          </div>
        </Link>

        <NavLink to="/bookings" mobile onClick={onNavigate}>
          Bookings
        </NavLink>

        <NavLink to="/partner/dashboard" mobile onClick={onNavigate}>
          {user.role === 'PARTNER'
            ? 'My Companion Profile'
            : 'Become a Companion'}
        </NavLink>

        {user.role === 'ADMIN' && (
          <Link
            to="/admin"
            onClick={onNavigate}
            className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Admin Dashboard
          </Link>
        )}

        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
        >
          My Profile
        </Link>

        <Link
          to="/account/settings"
          onClick={onNavigate}
          className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
        >
          Account Settings
        </Link>

        <Link
          to="/payments"
          onClick={onNavigate}
          className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
        >
          Payment History
        </Link>

        {/* Notifications */}
        <div className="flex items-center justify-between rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-neutral-600">
            Notifications
          </span>

          <NotificationBell />
        </div>

        {/* Logout */}
        <div className="border-t border-neutral-100 pt-3">
          <button
            onClick={() => {
              logout();
              onNavigate?.();
            }}
            disabled={isPending}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {isPending ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </div>
    );
  }

  /*
   * Desktop navigation
   */
  return (
    <div className="flex items-center gap-4 xl:gap-6">
      <NavLink to="/bookings">Bookings</NavLink>

      <NavLink to="/partner/dashboard">
        {user.role === 'PARTNER'
          ? 'My Companion Profile'
          : 'Become a Companion'}
      </NavLink>

      {user.role === 'ADMIN' && (
        <Link
          to="/admin"
          className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
        >
          Admin
        </Link>
      )}

      <div className="ml-1 flex items-center gap-3 border-l border-neutral-200 pl-4">
        <NotificationBell />

        <Link
          to="/profile"
          className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-neutral-50"
        >
          <UserAvatar
            fullName={user.fullName}
            profileImage={user.profileImage}
            size="sm"
          />

          <div className="hidden xl:block">
            <p className="text-xs font-medium text-neutral-400">
              Welcome back
            </p>

            <p className="max-w-28 truncate text-sm font-semibold text-neutral-800">
              {user.fullName.split(' ')[0]}
            </p>
          </div>
        </Link>

        <button
          onClick={() => logout()}
          disabled={isPending}
          className="whitespace-nowrap text-xs font-medium text-neutral-400 transition hover:text-red-600 disabled:opacity-50"
        >
          {isPending ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-sm transition group-hover:bg-brand-700">
              S
            </div>

            <div>
              <span className="text-lg font-bold tracking-tight text-neutral-900">
                Super
              </span>

              <span className="text-lg font-bold tracking-tight text-brand-600">
                Buddy
              </span>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden h-full items-center gap-8 lg:flex">
            <NavLink to="/partners">Discover</NavLink>

            <AuthNav />
          </nav>

          {/* ================= MOBILE HEADER ================= */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Notification for logged-in users */}
            {useAuthStore.getState().user && <NotificationBell />}

            {/* Hamburger */}
            <button
              type="button"
              aria-label={
                mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-100 bg-white lg:hidden">
            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
              <div className="space-y-1">
                <NavLink
                  to="/partners"
                  mobile
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Discover companions
                </NavLink>

                <AuthNav
                  mobile
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ================= MAIN ================= */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {/* Footer columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
            {/* Brand */}
            <div>
              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                  S
                </div>

                <span className="font-bold text-neutral-900">
                  Super<span className="text-brand-600">Buddy</span>
                </span>
              </Link>

              <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500">
                A trusted platform for finding companions for activities,
                travel, events, and everyday experiences.
              </p>

              <p className="mt-4 text-xs font-medium text-neutral-400">
                Non-sexual companionship platform
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Explore
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  to="/partners"
                  className="block text-sm text-neutral-500 transition hover:text-neutral-900"
                >
                  Find companions
                </Link>

                <Link
                  to="/partner/dashboard"
                  className="block text-sm text-neutral-500 transition hover:text-neutral-900"
                >
                  Become a companion
                </Link>

                <Link
                  to="/bookings"
                  className="block text-sm text-neutral-500 transition hover:text-neutral-900"
                >
                  My bookings
                </Link>
              </div>
            </div>

            {/* Safety */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Safety
              </h3>

              <div className="mt-4 space-y-3">
                <span className="block text-sm text-neutral-500">
                  Verified profiles
                </span>

                <span className="block text-sm text-neutral-500">
                  Reporting & blocking
                </span>

                <span className="block text-sm text-neutral-500">
                  SOS support
                </span>
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Account
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  to="/profile"
                  className="block text-sm text-neutral-500 transition hover:text-neutral-900"
                >
                  Profile
                </Link>

                <Link
                  to="/account/settings"
                  className="block text-sm text-neutral-500 transition hover:text-neutral-900"
                >
                  Account settings
                </Link>

                <Link
                  to="/payments"
                  className="block text-sm text-neutral-500 transition hover:text-neutral-900"
                >
                  Payment history
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 flex flex-col gap-4 border-t border-neutral-100 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-400">
              © {new Date().getFullYear()} SuperBuddy. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
              <span>Safe community</span>
              <span>•</span>
              <span>Real connections</span>
              <span>•</span>
              <span>Real experiences</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}