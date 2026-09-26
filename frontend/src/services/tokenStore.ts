/**
 * The access token lives in memory only — never localStorage/sessionStorage.
 * This keeps it out of reach of XSS-based storage scraping; the refresh
 * token (which can mint new access tokens) is an httpOnly cookie the
 * browser JS can't touch at all. Losing the access token on a hard refresh
 * is expected — the app calls /auth/refresh on load to silently recover it.
 */
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
};
