export type ReportReason =
  | 'HARASSMENT'
  | 'INAPPROPRIATE_CONTENT'
  | 'SAFETY_CONCERN'
  | 'FRAUD'
  | 'SPAM'
  | 'SEXUAL_SOLICITATION'
  | 'OTHER';

export interface CreateReportPayload {
  reportedUserId: string;
  bookingId?: string;
  reason: ReportReason;
  description: string;
}

export interface BlockedUser {
  id: string;
  blockedUser: { id: string; fullName: string; profileImage: string | null };
  createdAt: string;
}
