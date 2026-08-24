import { logger } from '../../config/logger';
import type { EmergencyAlertPayload, EmergencyNotificationProvider } from './EmergencyNotificationProvider';

/**
 * DEVELOPMENT-ONLY emergency provider. Logs what would have been sent
 * (e.g. via Twilio SMS in production — see the original stack notes) rather
 * than actually paging anyone. This is the only provider currently wired
 * up: in-app + persisted notifications to admins and the booking's other
 * participant (handled in sos.service.ts, not here) already give a real
 * signal path even without SMS. Building a real Twilio integration without
 * a genuine emergency-response process behind it would be a false sense of
 * safety, so it's intentionally left as an honest stub rather than faked.
 */
export const devEmergencyProvider: EmergencyNotificationProvider = {
  async notifyEmergencyContact(payload: EmergencyAlertPayload, contact) {
    logger.warn(
      { payload, contact: { name: contact.name, phone: contact.phone } },
      'DEV emergency provider: would have sent an SMS to this emergency contact'
    );
  },
};
