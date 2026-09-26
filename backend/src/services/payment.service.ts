import { bookingRepository } from '../repositories/booking.repository';
import { paymentRepository } from '../repositories/payment.repository';
import { paymentProvider } from './payments';
import { toPublicPayment } from '../utils/serializers';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/AppError';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { notifyUser } from './notification.service';
import type { CreateOrderInput, PaymentHistoryQuery, VerifyPaymentInput } from '../validators/payment.validators';

const MS_PER_HOUR = 60 * 60 * 1000;

export const paymentService = {
  async createOrder(userId: string, input: CreateOrderInput) {
    const booking = await bookingRepository.findById(input.bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Only the customer who made the booking can pay for it — not the
    // partner, and not anyone else. 404 rather than 403 to avoid confirming
    // the booking id exists to someone with no relationship to it.
    if (booking.userId !== userId) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.status !== 'ACCEPTED') {
      throw new BadRequestError(
        'This booking must be accepted by the partner before it can be paid for'
      );
    }

    const alreadyPaid = await paymentRepository.findPaidPaymentForBooking(booking.id);
    if (alreadyPaid) {
      throw new ConflictError('This booking has already been paid for');
    }

    if (!booking.pricePerHourQuoted) {
      throw new BadRequestError('This booking has no price set and cannot be paid for');
    }

    const durationHours =
      (booking.scheduledEnd.getTime() - booking.scheduledStart.getTime()) / MS_PER_HOUR;
    const amount = Math.round(Number(booking.pricePerHourQuoted) * durationHours * 100) / 100;
    const amountInPaise = Math.round(amount * 100);

    const order = await paymentProvider.createOrder({
      amountInPaise,
      currency: 'INR',
      receipt: booking.id,
    });

    const payment = await paymentRepository.create({
      bookingId: booking.id,
      userId,
      amount,
      currency: 'INR',
      status: 'CREATED',
      razorpayOrderId: order.orderId,
    });

    logger.info({ bookingId: booking.id, paymentId: payment.id, amount }, 'Payment order created');

    return {
      payment: toPublicPayment(payment),
      // Only meaningful when the real Razorpay provider is active — the
      // frontend checkout widget needs the public key id, never the secret.
      razorpayKeyId: env.RAZORPAY_KEY_ID ?? null,
    };
  },

  async verifyPayment(userId: string, input: VerifyPaymentInput) {
    const payment = await paymentRepository.findByOrderId(input.razorpayOrderId);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }
    if (payment.userId !== userId) {
      throw new NotFoundError('Payment not found');
    }

    // Idempotent: if this order was already verified successfully (e.g. the
    // client retried after a network blip on the first response), just
    // return the existing PAID record rather than re-verifying or erroring.
    if (payment.status === 'PAID') {
      return toPublicPayment(payment);
    }

    const isValid = paymentProvider.verifySignature({
      orderId: input.razorpayOrderId,
      paymentId: input.razorpayPaymentId,
      signature: input.razorpaySignature,
    });

    if (!isValid) {
      const failed = await paymentRepository.markFailed(payment.id, 'Signature verification failed');
      logger.warn({ paymentId: payment.id }, 'Payment signature verification failed');
      // Still a 400, but we return the FAILED record's shape via the thrown
      // error message — the client checks response status, not this body.
      void failed;
      throw new BadRequestError('Payment verification failed');
    }

    const updated = await paymentRepository.markPaid(
      payment.id,
      input.razorpayPaymentId,
      input.razorpaySignature
    );

    logger.info({ paymentId: payment.id, bookingId: payment.bookingId }, 'Payment verified and marked PAID');

    const booking = await bookingRepository.findParticipants(payment.bookingId);
    if (booking) {
      await notifyUser({
        userId: booking.partnerProfile.userId,
        type: 'PAYMENT_RECEIVED',
        title: 'Payment received',
        body: `A payment of ₹${Number(updated.amount).toFixed(2)} has been received for your booking.`,
        data: { bookingId: payment.bookingId, paymentId: payment.id },
      });
    }

    return toPublicPayment(updated);
  },

  async getPaymentById(userId: string, paymentId: string) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment || payment.userId !== userId) {
      throw new NotFoundError('Payment not found');
    }
    return toPublicPayment(payment);
  },

  async listHistory(userId: string, query: PaymentHistoryQuery) {
    const { items, total } = await paymentRepository.findMany({
      userId,
      page: query.page,
      limit: query.limit,
    });

    return {
      items: items.map(toPublicPayment),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },
};
