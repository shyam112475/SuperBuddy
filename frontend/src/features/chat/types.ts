export interface ChatMessage {
  id: string;
  bookingId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
  sender: { id: string; fullName: string; profileImage: string | null };
}

export interface MessageListResult {
  items: ChatMessage[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
