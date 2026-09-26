import { logger } from '../../config/logger';
import type { PushPayload, PushProvider } from './PushProvider';

/**
 * DEVELOPMENT-ONLY push provider. Logs what would have been sent instead of
 * calling Firebase. This is the active provider whenever Firebase env vars
 * aren't set (see index.ts) — every environment falls back here until a
 * real FCM provider is wired up, which per the original spec is
 * intentionally deferred past this phase (device-token registration/storage
 * is its own piece of work, not yet built). Not for production use.
 */
export const devPushProvider: PushProvider = {
  async send(payload: PushPayload): Promise<void> {
    logger.info({ payload }, 'DEV push provider: would have sent a push notification');
  },
};
