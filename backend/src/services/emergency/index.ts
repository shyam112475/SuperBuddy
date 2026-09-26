import { devEmergencyProvider } from './devEmergencyProvider';
import type { EmergencyNotificationProvider } from './EmergencyNotificationProvider';

// Always the dev provider for now — see devEmergencyProvider.ts for why a
// real SMS/Twilio integration isn't wired up yet. In-app + admin
// notifications (sos.service.ts) are the real, functioning alert path.
export const emergencyProvider: EmergencyNotificationProvider = devEmergencyProvider;
