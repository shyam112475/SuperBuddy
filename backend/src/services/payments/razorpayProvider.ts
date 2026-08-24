import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../../config/env';
import type { CreateOrderParams, CreatedOrder, PaymentProvider, VerifySignatureParams } from './PaymentProvider';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID!,
  key_secret: env.RAZORPAY_KEY_SECRET!,
});

export const razorpayPaymentProvider: PaymentProvider = {
  async createOrder({ amountInPaise, currency, receipt }: CreateOrderParams): Promise<CreatedOrder> {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
    });
    return { orderId: order.id, amount: Number(order.amount), currency: order.currency };
  },

  // Razorpay's documented verification: HMAC-SHA256 of "orderId|paymentId"
  // using the account's key secret, compared against the signature Razorpay
  // sends back after checkout. This is the actual proof of payment — the
  // frontend's "success" callback alone is never trusted.
  verifySignature({ orderId, paymentId, signature }: VerifySignatureParams): boolean {
    const expected = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Constant-time comparison — avoids leaking signature bytes via timing.
    const expectedBuf = Buffer.from(expected);
    const actualBuf = Buffer.from(signature);
    return (
      expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf)
    );
  },
};
