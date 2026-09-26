import { useEffect } from 'react';
import { apiClient } from '@/services/api';
import { tokenStore } from '@/services/tokenStore';
import { secureStorage } from '@/services/secureStorage';
import { useAuthStore } from '@/store/authStore';
import type { ApiSuccessResponse } from '@/types/api';
import type { PublicUser } from './types';

/**
 * Runs once on app launch. If a refresh token was persisted from a previous
 * session, exchanges it for a fresh access token + user — so a killed and
 * reopened app doesn't force a re-login. Mirrors the web app's
 * useSessionInit, adapted for SecureStore instead of an httpOnly cookie.
 */
export function useSessionInit() {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const storedRefreshToken = await secureStorage.getRefreshToken();
      if (!storedRefreshToken) {
        if (!cancelled) setInitializing(false);
        return;
      }

      try {
        const { data } = await apiClient.post<
          ApiSuccessResponse<{ user: PublicUser; accessToken: string; refreshToken: string }>
        >('/auth/refresh', { refreshToken: storedRefreshToken });

        tokenStore.set(data.data.accessToken);
        await secureStorage.setRefreshToken(data.data.refreshToken);
        if (!cancelled) setUser(data.data.user);
      } catch {
        tokenStore.set(null);
        await secureStorage.clearRefreshToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setUser, setInitializing]);
}
