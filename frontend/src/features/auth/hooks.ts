import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from './authApi';
import { tokenStore } from '../../services/tokenStore';
import { useAuthStore } from '../../store/authStore';
import type { LoginPayload, RegisterPayload } from './types';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ user, accessToken }) => {
      tokenStore.set(accessToken);
      setUser(user);
      navigate('/');
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: ({ user, accessToken }) => {
      tokenStore.set(accessToken);
      setUser(user);
      navigate('/');
    },
  });
}

export function useLogout() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Clear local state regardless of whether the network call succeeded —
      // the user's intent is to be logged out either way.
      tokenStore.set(null);
      setUser(null);
      queryClient.clear();
      navigate('/login');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
    onSuccess: () => navigate('/login'),
  });
}
