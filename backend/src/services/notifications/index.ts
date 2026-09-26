import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { devPushProvider } from './devPushProvider';
import type { PushProvider } from './PushProvider';

const firebaseConfigured = Boolean(
  env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY
);

if (!firebaseConfigured) {
  logger.warn(
    'FIREBASE_* env vars not set — using devPushProvider (dev-only, not for production)'
  );
} else {
  // Per the original roadmap, FCM integration is intentionally deferred:
  // sending a push requires a registered device token per user, and device
  // token registration (mobile/web client → POST /api/users/me/device-token
  // or similar) hasn't been built yet. Falling back to the dev provider
  // even when credentials ARE present is deliberate — wiring up
  // firebase-admin against zero stored device tokens would be a
  // pretend-production implementation, which the project's code-quality
  // rules explicitly rule out. Build device-token storage first, then swap
  // this for a real firebase-admin call.
  logger.warn(
    'Firebase credentials detected, but device-token storage is not yet implemented — still using devPushProvider'
  );
}

export const pushProvider: PushProvider = devPushProvider;
