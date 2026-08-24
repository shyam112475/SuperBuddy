import { bookingRepository } from '../repositories/booking.repository';
import { reviewRepository } from '../repositories/review.repository';
import { toPublicReview } from '../utils/serializers';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/AppError';
import { logger } from '../config/logger';
import { notifyUser } from './notification.service';
import type { CreateReviewInput, ListPartnerReviewsQuery } from '../validators/review.validators';

export const reviewService = {
  async createReview(userId: string, input: CreateReviewInput) {
    const booking = await bookingRepository.findById(input.bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Rule: review must belong to the relevant booking — only the customer
    // who made the booking can review it. 404, not 403, to avoid confirming
    // the booking id exists to someone with no relationship to it.
    if (booking.userId !== userId) {
      throw new NotFoundError('Booking not found');
    }

    // Rule: user cannot review themselves. Not reachable in practice (a
    // partner can't book their own profile — enforced at booking creation)
    // but kept as an explicit, defensive check since the spec calls it out
    // as its own rule rather than an implied consequence of another one.
    if (booking.partnerProfile.user.id === userId) {
      throw new BadRequestError("You can't review yourself");
    }

    // Rule: review only after a completed booking.
    if (booking.status !== 'COMPLETED') {
      throw new BadRequestError('You can only review a completed booking');
    }

    // Rule: one review per booking. The DB's unique constraint on
    // Review.bookingId is the real guarantee against a race; this check
    // just gives a clean error message instead of a raw constraint failure.
    const existing = await reviewRepository.findByBookingId(booking.id);
    if (existing) {
      throw new ConflictError('You have already reviewed this booking');
    }

    const review = await reviewRepository.createWithRatingUpdate({
      bookingId: booking.id,
      reviewerId: userId,
      partnerProfileId: booking.partnerProfileId,
      rating: input.rating,
      comment: input.comment,
    });

    logger.info({ bookingId: booking.id, rating: input.rating }, 'Review created');

    await notifyUser({
      userId: booking.partnerProfile.user.id,
      type: 'REVIEW_RECEIVED',
      title: 'New review',
      body: `You received a ${input.rating}-star review${input.comment ? ': "' + (input.comment.length > 100 ? input.comment.slice(0, 97) + '...' : input.comment) + '"' : '.'}`,
      data: { bookingId: booking.id, reviewId: review.id },
    });

    return toPublicReview(review);
  },

  async listForPartner(partnerProfileId: string, query: ListPartnerReviewsQuery) {
    const { items, total } = await reviewRepository.findByPartner(partnerProfileId, query);

    return {
      items: items.map(toPublicReview),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },
};
