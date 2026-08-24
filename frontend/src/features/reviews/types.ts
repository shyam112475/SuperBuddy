export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { id: string; fullName: string; profileImage: string | null };
}

export interface ReviewListResult {
  items: Review[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}
