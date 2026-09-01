import { create } from 'zustand';
import type { PublicUser } from '@/features/auth/types';

interface AuthState {
  user: PublicUser | null;
  /** True until the app has tried exchanging a stored refresh token for a session on launch. */
  isInitializing: boolean;
  setUser: (user: PublicUser | null) => void;
  setInitializing: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,
  setUser: (user) => set({ user }),
  setInitializing: (value) => set({ isInitializing: value }),
}));
