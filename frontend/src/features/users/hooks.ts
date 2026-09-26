import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { usersApi } from './usersApi';
import { useAuthStore } from '../../store/authStore';
import { tokenStore } from '../../services/tokenStore';
import type { ChangePasswordPayload, UpdateProfilePayload } from './types';

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: async () => {
      const user = await usersApi.getMe();
      setUser(user); // keep the auth store's copy fresh too
      return user;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => usersApi.updateProfile(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['users', 'me'], user);
    },
  });
}

export function useUploadProfileImage() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (file: File) => usersApi.uploadProfileImage(file),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['users', 'me'], user);
    },
  });
}

export function useChangePassword() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => usersApi.changePassword(payload),
    onSuccess: () => {
      // Backend revokes all sessions on password change — reflect that locally.
      tokenStore.set(null);
      setUser(null);
      navigate('/login');
    },
  });
}

export function useDeleteAccount() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.deleteAccount(),
    onSuccess: () => {
      tokenStore.set(null);
      setUser(null);
      queryClient.clear();
      navigate('/');
    },
  });
}
