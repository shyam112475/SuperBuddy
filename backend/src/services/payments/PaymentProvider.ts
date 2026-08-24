/**
 * Payment-gateway abstraction. Services/controllers depend on this
 * interface, never on Razorpay directly, so a future gateway swap (or a
 * second gateway for a different market) doesn't touch calling code.
 */
export interface CreateOrderParams {
  amountInPaise: number;
  currency: string;
  receipt: string;
}

export interface CreatedOrder {
  orderId: string;
  amount: number;
  currency: string;
}

export interface VerifySignatureParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentProvider {
  createOrder(params: CreateOrderParams): Promise<CreatedOrder>;
  /** Returns true only if the signature is a valid HMAC over orderId|paymentId. */
  verifySignature(params: VerifySignatureParams): boolean;
}
