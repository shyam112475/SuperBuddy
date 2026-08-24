/**
 * Push-notification abstraction. Sends to a user's registered device(s) —
 * the in-app notification inbox (Notification model) is persisted
 * separately regardless of whether push succeeds, so a push failure never
 * loses a notification, just the "ping the phone" side of it.
 */
export interface PushPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface PushProvider {
  send(payload: PushPayload): Promise<void>;
}
