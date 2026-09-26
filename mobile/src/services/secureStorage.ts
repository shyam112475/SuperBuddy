import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'companionhub_refresh_token';

/**
 * The refresh token is the one piece of auth state that needs to survive
 * an app restart — it lives in the OS-encrypted keystore (Keychain on iOS,
 * Keystore-backed EncryptedSharedPreferences on Android), never in plain
 * AsyncStorage. The short-lived access token deliberately stays in memory
 * only (see tokenStore.ts) — same reasoning as the web app's approach,
 * just backed by SecureStore instead of an httpOnly cookie, since React
 * Native can't rely on cookie persistence (see mobile architecture notes
 * in the backend's docs/API.md).
 */
export const secureStorage = {
  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  async clearRefreshToken(): Promise<void> {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
