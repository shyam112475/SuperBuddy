import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AdminRoute() {
  const user = useAuthStore((s) => s.user);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="relative mb-5 h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-neutral-200" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-neutral-900" />
          </div>

          <h2 className="text-base font-semibold text-neutral-900">
            Loading Admin Panel
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Checking your access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Not just "logged in" — the server independently re-checks role on every
  // admin request too (authorize('ADMIN') in admin.routes.ts). This is only
  // a UX guard to avoid rendering admin UI for the wrong user; it is never
  // the actual security boundary.
  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}