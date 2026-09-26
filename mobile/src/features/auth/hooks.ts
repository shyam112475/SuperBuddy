import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authApi } from './authApi';
import { tokenStore } from '@/services/tokenStore';
import { secureStorage } from '@/services/secureStorage';
import { useAuthStore } from '@/store/authStore';
import type { AuthResponse, LoginPayload, RegisterPayload } from './types';

/** Shared by login and register — both end in the same "persist + navigate" steps. */
async function establishSession(auth: AuthResponse) {
  tokenStore.set(auth.accessToken);
  await secureStorage.setRefreshToken(auth.refreshToken);
  useAuthStore.getState().setUser(auth.user);
}

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: async (data) => {
      await establishSession(data);
      router.replace('/(app)/(tabs)');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: async (data) => {
      await establishSession(data);
      router.replace('/(app)/(tabs)');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const refreshToken = await secureStorage.getRefreshToken();
      // Best-effort — even if the network call fails (offline, server
      // error), we still clear local session state below so the user is
      // signed out on this device regardless.
      await authApi.logout(refreshToken).catch(() => {});
    },
    onSettled: async () => {
      tokenStore.set(null);
      await secureStorage.clearRefreshToken();
      useAuthStore.getState().setUser(null);
      router.replace('/(auth)/login');
    },
  });
}
