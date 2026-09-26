/**
 * The access token lives in memory only — never persisted, mirroring the
 * web app's approach. Lost on app kill, recovered on next launch via
 * useSessionInit() exchanging the persisted refresh token for a fresh one.
 */
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
};
