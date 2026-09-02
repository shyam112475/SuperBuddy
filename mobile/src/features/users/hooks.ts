import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { usersApi, type PickedImage } from './usersApi';
import { useAuthStore } from '@/store/authStore';
import { tokenStore } from '@/services/tokenStore';
import { secureStorage } from '@/services/secureStorage';
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
    mutationFn: (image: PickedImage) => usersApi.uploadProfileImage(image),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['users', 'me'], user);
    },
  });
}

export function useChangePassword() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => usersApi.changePassword(payload),
    onSuccess: async () => {
      // Backend revokes all sessions on password change — reflect that locally.
      tokenStore.set(null);
      await secureStorage.clearRefreshToken();
      setUser(null);
      router.replace('/(auth)/login');
    },
  });
}

export function useDeleteAccount() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersApi.deleteAccount(),
    onSuccess: async () => {
      tokenStore.set(null);
      await secureStorage.clearRefreshToken();
      setUser(null);
      queryClient.clear();
      router.replace('/(auth)/login');
    },
  });
}
