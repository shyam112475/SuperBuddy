export type SOSStatus = 'ACTIVE' | 'RESOLVED' | 'FALSE_ALARM';

export interface SOSAlert {
  id: string;
  bookingId: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  status: SOSStatus;
  resolvedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
}

export interface CreateSOSAlertPayload {
  bookingId?: string;
  latitude: number;
  longitude: number;
  description?: string;
}
