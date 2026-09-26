/**
 * Expo inlines any env var prefixed EXPO_PUBLIC_ at build time — see
 * https://docs.expo.dev/guides/environment-variables/. Set these in a
 * `.env` file at the project root (see `.env.example`).
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  socketUrl: (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api').replace(/\/api\/?$/, ''),
};
