export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type DayOfWeek =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface PartnerServiceOffering {
  id: string;
  category: Pick<ServiceCategory, 'id' | 'name' | 'slug'>;
  description: string | null;
  pricePerHour: number | null;
}

export interface AvailabilitySlot {
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;
}

export interface PublicPartner {
  id: string;
  headline: string;
  bio: string;
  city: string;
  area: string | null;
  isAcceptingBookings: boolean;
  averageRating: number | null;
  reviewCount: number;
  createdAt: string;
  partner: {
    id: string;
    fullName: string;
    profileImage: string | null;
    gender: Gender | null;
    verificationStatus: VerificationStatus;
  };
  services: PartnerServiceOffering[];
  availability: AvailabilitySlot[];
}

export interface PartnerSearchResult {
  items: PublicPartner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PartnerSearchFilters {
  page?: number;
  city?: string;
  gender?: Gender;
  serviceCategory?: string;
  dayOfWeek?: DayOfWeek;
  search?: string;
}

export interface CreatePartnerProfilePayload {
  headline: string;
  bio: string;
  city: string;
  area?: string;
}

export interface UpdatePartnerProfilePayload {
  headline?: string;
  bio?: string;
  city?: string;
  area?: string;
  isAcceptingBookings?: boolean;
}

export interface AddServiceOfferingPayload {
  serviceCategoryId: string;
  description?: string;
  pricePerHour?: number;
}
