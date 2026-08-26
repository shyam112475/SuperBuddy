import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../features/auth/hooks';
import { NotificationBell } from '../features/notifications/NotificationBell';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';
import settingsIcon from '../assets/—Pngtree—settings glyph black icon_3755352.png';
import profileIcon from '../assets/—Pngtree—man with binoculars looking to_8694411.png';// Replace with your logo Icon
import bookingIcon from '../assets/bookings.png';
import SearchIcon from '../assets/search.jpg';
import AdminIcon from '../assets/admin.jpg';
import userIcon from '../assets/user.jpg';
import paymentIcon from '../assets/payment.jpg';
import logoutIcon from '../assets/logout.jpg';

/**
 * ============================================================================
 * PREMIUM NAVIGATION LINK COMPONENT
 * Desktop: Gradient underline, Mobile: Pill background with icon
 * ============================================================================
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

/**
 * ============================================================================
 * PREMIUM AUTHENTICATION NAVIGATION
 * Shows different UI based on auth state (logged in vs logged out)
 * ============================================================================
 */
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

  // Loading state
  if (isInitializing) {
    return mobile ? (
      <div className="h-10 animate-pulse rounded-lg bg-neutral-100" />
    ) : (
      <div className="h-8 w-20 animate-pulse rounded-lg bg-neutral-100" />
    );
  }

  // UNAUTHENTICATED - Not logged in
  if (!user) {
    if (mobile) {
      return (
        <div className="border-t border-neutral-200 pt-4 mt-2 space-y-2">
          <Link to="/login" onClick={onNavigate}>
            <Button variant="outline" fullWidth size="sm">
              Sign in
            </Button>
          </Link>

          <Link to="/register" onClick={onNavigate}>
            <Button variant="primary" fullWidth size="sm">
              Get started
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>

        <Link to="/register">
          <Button variant="primary" size="sm">
            Get started
          </Button>
        </Link>
      </div>
    );
  }

  // AUTHENTICATED - Mobile Menu
  if (mobile) {
    return (
      <div className="space-y-1">
        {/* User Card Header */}
        <Link
          to="/profile"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 rounded-2xl p-3 transition-all duration-200',
            'bg-neutral-50 hover:bg-neutral-100 mb-4'
          )}
        >
          <Avatar
            name={user.fullName}
            src={user.profileImage || undefined}
            size="md"
            verified={user.verificationStatus === 'VERIFIED'}
          />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-neutral-500">Welcome back</p>
            <p className="truncate text-sm font-bold text-neutral-900">
              {user.fullName}
            </p>
          </div>

          <svg
            className="h-5 w-5 shrink-0 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>

        {/* Main Navigation Items */}
        <NavLink to="/bookings" mobile onClick={onNavigate} icon="">
          My Bookings
        </NavLink>

        <NavLink
          to="/partner/dashboard"
          mobile
          onClick={onNavigate}
          icon={user.role === 'PARTNER' ? <img
      src={userIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    /> :  <img
      src={AdminIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    />}
        >
          {user.role === 'PARTNER'
            ? 'Companion Profile'
            : 'Become a Companion'}
        </NavLink>

        {user.role === 'ADMIN' && (
          <NavLink to="/admin" mobile onClick={onNavigate} 
           icon={
    <img
      src={AdminIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    />}>
            Admin Dashboard
          </NavLink>
        )}

        {/* Divider */}
        <div className="my-2 border-t border-neutral-100" />

        {/* Secondary Navigation */}
        <NavLink to="/profile" mobile onClick={onNavigate}  icon={
    <img
      src={profileIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    />
  }>
          My Profile
        </NavLink>

        <NavLink
  to="/account/settings"
  mobile
  onClick={onNavigate}
  icon={
    <img
      src={settingsIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    />
  }
>
  Settings
</NavLink>

        <NavLink to="/payments" mobile onClick={onNavigate}  icon={
    <img
      src={paymentIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    />
  }>
          Payment History
        </NavLink>

        {/* Notifications & Logout */}
        <div className="flex items-center justify-between rounded-lg px-4 py-3 mt-2">
          <span className="text-sm font-medium text-neutral-600">
            Notifications
          </span>

          <NotificationBell />
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          disabled={isPending}
          className={cn(
            'w-full mt-2 flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
            'text-neutral-600 hover:bg-red-50 hover:text-red-700',
            isPending && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isPending ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    );
  }

  // AUTHENTICATED - Desktop Navigation
  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <NotificationBell />

      {/* User Dropdown Menu */}
      <div className="relative group">
        <button className="flex items-center gap-2 rounded-full hover:bg-neutral-100 transition-colors duration-200 p-1">
          <Avatar
            name={user.fullName}
            src={user.profileImage || undefined}
            size="sm"
            verified={user.verificationStatus === 'VERIFIED'}
          />
          <svg
            className="h-4 w-4 text-neutral-600 group-hover:text-neutral-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {/* Dropdown Menu - Hidden by default, shown on hover */}
        <div className="absolute right-0 mt-0 w-56 rounded-2xl bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-neutral-200">
          {/* User Info */}
          <div className="px-4 py-4 border-b border-neutral-100">
            <p className="text-xs text-neutral-500">Signed in as</p>
            <p className="text-sm font-bold text-neutral-900 truncate">
              {user.fullName}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="py-2 space-y-1">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <span>
                 <img
      src={userIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    />
                </span> My Profile
            </Link>

            <Link
              to="/bookings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <span> <img
      src={bookingIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    /></span> My Bookings
            </Link>

            <Link
              to="/partner/dashboard"
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <span>{user.role === 'PARTNER' ?  <img
      src={userIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    /> : <img
      src={profileIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    /> }</span>
              {user.role === 'PARTNER'
                ? 'Companion Profile'
                : 'Become a Companion'}
            </Link>

            <Link
              to="/payments"
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <span><img
      src={paymentIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    /></span> Payment History
            </Link>

            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium"
              >
                <span> <img
      src={AdminIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    /></span> Admin Dashboard
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100" />

          {/* Settings & Logout */}
          <div className="py-2 space-y-1">
            <Link
              to="/account/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <span><img
      src={settingsIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    /></span> Settings
            </Link>

            <button
              type="button"
              onClick={() => logout()}
              disabled={isPending}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors',
                isPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span><img
      src={logoutIcon}
      alt="Settings"
      className="w-5 h-5 object-contain"
    /></span> {isPending ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PREMIUM MAIN LAYOUT COMPONENT
 * ============================================================================
 */
export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-0">
      {/* ========== PREMIUM HEADER ========== */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
          {/* ========== LOGO ========== */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
          >
            {/* Logo Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-600 text-base font-bold shadow-button transition-all duration-200 group-hover:shadow-button-hover">
              SB
            </div>
            {/* Logo Text */}
            <div className="hidden sm:block">
              <span className="text-base lg:text-lg font-bold tracking-tight text-neutral-900">
                Super
              </span>
              <span className="text-base lg:text-lg font-bold tracking-tight text-brand-600">
                Buddy
              </span>
            </div>
          </Link>

          {/* ========== DESKTOP NAV ========== */}
          <nav className="hidden h-full items-center gap-8 lg:flex">
            <NavLink to="/partners" >
            <img 
      src={SearchIcon} 
      alt="Discover" 
      className="h-5 w-5 object-contain" 
    />
              Discover
            </NavLink>

            <AuthNav />
          </nav>

          {/* ========== MOBILE HEADER ========== */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Notification for logged-in users */}
            {useAuthStore.getState().user && <NotificationBell />}

            {/* Hamburger Menu Button */}
            <button
              type="button"
              aria-label={
                mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-200"
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

        {/* ========== PREMIUM MOBILE MENU ========== */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 bg-white lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <div className="space-y-2">
                <NavLink
                  to="/partners"
                  mobile
                  icon="🔍"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Discover Companions
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

      {/* ========== MAIN CONTENT ========== */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      {/* ========== PREMIUM FOOTER ========== */}
      <footer className="border-t border-neutral-200 bg-neutral-0 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-12">
            {/* About */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                {/* Logo Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-600 text-base font-bold shadow-button transition-all duration-200 group-hover:shadow-button-hover">
              SB
            </div>
                <span className="font-bold text-neutral-900">SuperBuddy</span>
              </div>

              <p className="text-sm text-neutral-600 mb-3">
                Connect with verified companions for
                travel, events, and everyday experiences.
              </p>

              <p className="text-xs font-medium text-neutral-400">
                Non-sexual companionship platform
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                Explore
              </h3>

              <div className="space-y-3">
                <Link
                  to="/partners"
                  className="block text-sm text-neutral-600 hover:text-brand-600 transition-colors duration-200 font-medium"
                >
                  Find companions
                </Link>

                <Link
                  to="/partner/dashboard"
                  className="block text-sm text-neutral-600 hover:text-brand-600 transition-colors duration-200 font-medium"
                >
                  Become a companion
                </Link>

                <Link
                  to="/bookings"
                  className="block text-sm text-neutral-600 hover:text-brand-600 transition-colors duration-200 font-medium"
                >
                  My bookings
                </Link>
              </div>
            </div>

            {/* Safety */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                Safety
              </h3>

              <div className="space-y-3">
                <span className="block text-sm text-neutral-600 font-medium">
                  ✓ Verified profiles
                </span>

                <span className="block text-sm text-neutral-600 font-medium">
                  ✓ Reporting & blocking
                </span>

                <span className="block text-sm text-neutral-600 font-medium">
                  ✓ SOS support
                </span>
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                Account
              </h3>

              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="block text-sm text-neutral-600 hover:text-brand-600 transition-colors duration-200 font-medium"
                >
                  Profile
                </Link>

                <Link
                  to="/account/settings"
                  className="block text-sm text-neutral-600 hover:text-brand-600 transition-colors duration-200 font-medium"
                >
                  Settings
                </Link>

                <Link
                  to="/payments"
                  className="block text-sm text-neutral-600 hover:text-brand-600 transition-colors duration-200 font-medium"
                >
                  Payment history
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-neutral-200 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500 font-medium">
              © {new Date().getFullYear()} SuperBuddy. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-neutral-500 font-medium">
              <span>✓ Safe community</span>
              <span className="text-neutral-300">•</span>
              <span>✓ Real connections</span>
              <span className="text-neutral-300">•</span>
              <span>✓ Real experiences</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
