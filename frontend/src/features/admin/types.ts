export interface DashboardStats {
  users: { total: number; partners: number; admins: number };
  bookings: Record<string, number>;
  revenue: { totalPaid: number; currency: string };
  safety: { activeSOSAlerts: number; openReports: number };
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  verificationStatus: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminPartner {
  id: string;
  headline: string;
  city: string;
  area: string | null;
  isAcceptingBookings: boolean;
  averageRating: number | null;
  reviewCount: number;
  createdAt: string;
  partner: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    verificationStatus: string;
    isActive: boolean;
  };
}

export interface AdminBooking {
  id: string;
  status: string;
  serviceCategoryName: string;
  scheduledStart: string;
  scheduledEnd: string;
  createdAt: string;
  customer: { id: string; fullName: string };
  partner: { id: string; fullName: string };
}

export interface AdminPayment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface AdminSOSAlert {
  id: string;
  status: string;
  latitude: number;
  longitude: number;
  description: string | null;
  resolvedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
  triggeredBy: { id: string; fullName: string };
}

export interface AdminReport {
  id: string;
  reason: string;
  description: string;
  status: string;
  resolutionNote: string | null;
  resolvedAt: string | null;
  createdAt: string;
  reporter: { id: string; fullName: string };
  reportedUser: { id: string; fullName: string };
}

export interface AdminListResult<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
