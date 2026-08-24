export type PaymentStatus = 'CREATED' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResult {
  payment: Payment;
  razorpayKeyId: string | null;
}

export interface PaymentListResult {
  items: Payment[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
