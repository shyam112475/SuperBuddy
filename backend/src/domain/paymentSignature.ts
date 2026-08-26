import crypto from 'crypto';

/**
 * Razorpay's documented verification scheme: HMAC-SHA256 of
 * "orderId|paymentId" using the account's key secret. Both the real
 * provider (services/payments/razorpayProvider.ts) and the dev mock
 * (services/payments/mockProvider.ts) used to duplicate this exact logic
 * with two different secrets — extracted here as one pure, dependency-free
 * function so there's a single implementation to test and trust.
 */
export function computePaymentSignature(secret: string, orderId: string, paymentId: string): string {
  return crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

/**
 * Constant-time comparison — avoids leaking signature bytes via timing,
 * same reasoning as any other secret comparison (see cookies/tokens
 * elsewhere in this codebase).
 */
export function verifyPaymentSignature(
  secret: string,
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const expected = computePaymentSignature(secret, orderId, paymentId);
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  return expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf);
}
