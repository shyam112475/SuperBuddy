const STORAGE_KEY = 'superbuddy_refresh_token';

/**
 * Capacitor WebViews persist localStorage across app launches, so the
 * refresh token returned by the API can be retained for the native build.
 * The backend rotates this token on every refresh.
 */
let cachedToken: string | null = null;

export async function getRefreshToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  try {
    cachedToken = localStorage.getItem(STORAGE_KEY);
  } catch {
    cachedToken = null;
  }
  return cachedToken;
}

export async function setRefreshToken(token: string | null) {
  cachedToken = token;
  try {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}
