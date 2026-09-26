/**
 * Emergency-alert dispatch abstraction. Deliberately not coupled to a
 * specific channel or vendor (SMS/Twilio, a paging service, email) — an SOS
 * alert firing should never be blocked on, or tied to, one provider's
 * uptime. See devEmergencyProvider.ts for the currently-active
 * implementation and why a real SMS integration isn't wired up yet.
 */
export interface EmergencyAlertPayload {
  sosAlertId: string;
  triggeredByUserId: string;
  triggeredByName: string;
  latitude: number;
  longitude: number;
  description: string | null;
  bookingId: string | null;
}

export interface EmergencyNotificationProvider {
  notifyEmergencyContact(
    payload: EmergencyAlertPayload,
    contact: { name: string; phone: string }
  ): Promise<void>;
}
