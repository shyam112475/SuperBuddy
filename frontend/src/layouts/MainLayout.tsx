import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../features/auth/hooks';
import { NotificationBell } from '../features/notifications/NotificationBell';

function AuthNav() {
  const user = useAuthStore((s) => s.user);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const { mutate: logout, isPending } = useLogout();

  if (isInitializing) return null;

  if (!user) {
    return (
      <>
        <Link to="/login" className="hover:text-neutral-900">
          Sign In
        </Link>
        <Link to="/register" className="hover:text-neutral-900">
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <>
      <Link to="/bookings" className="hover:text-neutral-900">
        Bookings
      </Link>
      <Link to="/partner/dashboard" className="hover:text-neutral-900">
        {user.role === 'PARTNER' ? 'My Companion Profile' : 'Become a Companion'}
      </Link>
      {user.role === 'ADMIN' && (
        <Link to="/admin" className="font-medium text-brand-600 hover:text-brand-700">
          Admin
        </Link>
      )}
      <NotificationBell />
      <Link to="/profile" className="text-neutral-500 hover:text-neutral-900">
        Hi, {user.fullName.split(' ')[0]}
      </Link>
      <button
        onClick={() => logout()}
        disabled={isPending}
        className="hover:text-neutral-900 disabled:opacity-50"
      >
        Sign Out
      </button>
    </>
  );
}

export function MainLayout() {
  return (
    <div className="flex min-h-full flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-brand-600">
            CompanionHub
          </Link>
          <nav className="flex items-center gap-6 text-sm text-neutral-600">
            <Link to="/partners" className="hover:text-neutral-900">
              Discover
            </Link>
            <AuthNav />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-400">
        CompanionHub — non-sexual companionship & activity platform
      </footer>
    </div>
  );
}
