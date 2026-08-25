import crypto from 'crypto';
import { logger } from '../../config/logger';
import type { CreateOrderParams, CreatedOrder, PaymentProvider, VerifySignatureParams } from './PaymentProvider';

/**
 * DEVELOPMENT-ONLY payment provider. Generates fake order ids instead of
 * calling Razorpay, so the full create-order → verify flow is testable
 * without real Razorpay credentials.
 *
 * Signature verification here is NOT theater — it uses the same
 * HMAC-SHA256(orderId|paymentId) scheme Razorpay uses, against a fixed dev
 * secret, so the security-critical verify path is genuinely exercised in
 * dev/test rather than skipped. It is NOT production-ready: no real money
 * moves, and the "dev secret" is public (it's right here in source). Set
 * RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET to use the real provider instead —
 * see razorpayProvider.ts.
 */
const DEV_SECRET = 'SuperBuddy-dev-only-payment-secret-do-not-use-in-prod';

export const mockPaymentProvider: PaymentProvider = {
  async createOrder({ amountInPaise, currency }: CreateOrderParams): Promise<CreatedOrder> {
    const orderId = `order_dev_${crypto.randomUUID()}`;

    // To complete a mock payment for manual testing, POST to
    // /api/payments/verify with this orderId, any paymentId, and the
    // signature this logs — see README "Testing payments without Razorpay".
    const samplePaymentId = `pay_dev_${crypto.randomUUID()}`;
    const sampleSignature = crypto
      .createHmac('sha256', DEV_SECRET)
      .update(`${orderId}|${samplePaymentId}`)
      .digest('hex');
    logger.info(
      { orderId, samplePaymentId, sampleSignature },
      'DEV payment provider: use these values to verify this order without a real Razorpay checkout'
    );

    return { orderId, amount: amountInPaise, currency };
  },

  verifySignature({ orderId, paymentId, signature }: VerifySignatureParams): boolean {
    const expected = crypto
      .createHmac('sha256', DEV_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const expectedBuf = Buffer.from(expected);
    const actualBuf = Buffer.from(signature);
    return (
      expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf)
    );
  },
};
