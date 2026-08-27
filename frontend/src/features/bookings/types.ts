export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
export type BookingActorRole = 'CUSTOMER' | 'PARTNER';

export interface Booking {
  id: string;
  status: BookingStatus;
  activityDescription: string;
  serviceCategoryName: string;
  scheduledStart: string;
  scheduledEnd: string;
  pricePerHourQuoted: number | null;
  cancelledByRole: BookingActorRole | null;
  cancellationReason: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  hasReview: number;
  viewerRole: BookingActorRole;
  customer: { id: string; fullName: string; profileImage: string | null };
  partner: {
    partnerProfileId: string;
    headline: string;
    city: string;
    id: string;
    fullName: string;
    profileImage: string | null;
  };
  offering: {
    id: string;
    description: string | null;
    category: { name: string; slug: string };
  } | null;
}

export interface BookingListResult {
  items: Booking[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface CreateBookingPayload {
  partnerProfileId: string;
  offeringId: string;
  activityDescription: string;
  scheduledStart: string;
  scheduledEnd: string;
}

export interface ListBookingsFilters {
  page?: number;
  as?: 'customer' | 'partner';
  status?: BookingStatus;
}
