import { useEffect } from 'react';
import { apiClient } from '../../services/api';
import { tokenStore } from '../../services/tokenStore';
import { useAuthStore } from '../../store/authStore';
import type { ApiSuccessResponse } from '../../types/api';
import type { AuthResponse } from './types';

/**
 * Runs once when the app mounts. The access token doesn't survive a page
 * reload (it's memory-only by design), so this silently exchanges the
 * httpOnly refresh cookie for a new access token + the current user,
 * restoring the session without the user having to log in again.
 * A logged-out visitor just gets a 401 here, which is expected and quiet.
 */
export function useSessionInit() {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>('/auth/refresh');
        if (!cancelled) {
          tokenStore.set(data.data.accessToken);
          setUser(data.data.user);
        }
      } catch {
        if (!cancelled) {
          tokenStore.set(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
