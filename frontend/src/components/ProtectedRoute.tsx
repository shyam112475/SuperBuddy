import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute() {
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
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-500" />
          </div>

          <h2 className="text-base font-semibold text-neutral-900">
            Loading your account
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Please wait a moment...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}