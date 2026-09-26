import { create } from 'zustand';
import type { PublicUser } from '../features/auth/types';

interface AuthState {
  user: PublicUser | null;
  /** True until the initial silent-refresh-on-load attempt has finished. */
  isInitializing: boolean;
  setUser: (user: PublicUser | null) => void;
  setInitializing: (value: boolean) => void;
}

/**
 * Holds only the current user + init status. The access token itself lives
 * in tokenStore (plain module state), not here — putting it in Zustand would
 * mean every token refresh re-renders every subscribed component for no
 * reason, and it doesn't need to be reactive UI state.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,
  setUser: (user) => set({ user }),
  setInitializing: (value) => set({ isInitializing: value }),
}));
