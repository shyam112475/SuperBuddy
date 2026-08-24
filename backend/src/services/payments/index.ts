import { env } from '../../config/env';
import { logger } from '../../config/logger';
import type { PaymentProvider } from './PaymentProvider';
import { razorpayPaymentProvider } from './razorpayProvider';
import { mockPaymentProvider } from './mockProvider';

const razorpayConfigured = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

if (!razorpayConfigured) {
  logger.warn(
    'RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET not set — using mockPaymentProvider (dev-only, not for production)'
  );
}

export const paymentProvider: PaymentProvider = razorpayConfigured
  ? razorpayPaymentProvider
  : mockPaymentProvider;
