import type { BookingStatus, NotificationType } from '@prisma/client';
import { bookingRepository } from '../repositories/booking.repository';
import { partnerRepository } from '../repositories/partner.repository';
import { blockRepository } from '../repositories/block.repository';
import { toPublicBooking } from '../utils/serializers';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/AppError';
import { logger } from '../config/logger';
import { notifyUser } from './notification.service';
import { canTransitionBooking, resolveBookingActor } from '../domain/bookingStateMachine';
import type {
  CancelBookingInput,
  CreateBookingInput,
  ListBookingsQuery,
  RejectBookingInput,
} from '../validators/booking.validators';

const TRANSITION_NOTIFICATION_TYPE: Partial<Record<BookingStatus, NotificationType>> = {
  ACCEPTED: 'BOOKING_ACCEPTED',
  REJECTED: 'BOOKING_REJECTED',
  CANCELLED: 'BOOKING_CANCELLED',
  COMPLETED: 'BOOKING_COMPLETED',
};

async function transition(
  userId: string,
  bookingId: string,
  toStatus: BookingStatus,
  extra: { cancellationReason?: string; rejectionReason?: string } = {}
) {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  const actor = resolveBookingActor(
    { userId: booking.userId, partnerUserId: booking.partnerProfile.user.id },
    userId
  );
  if (!actor) {
    // Not a party to this booking — 404 rather than 403 so an unrelated
    // user can't even confirm the booking id exists.
    throw new NotFoundError('Booking not found');
  }

  if (!canTransitionBooking(booking.status, toStatus, actor)) {
    throw new ConflictError(
      `This booking is ${booking.status.toLowerCase()} and can't be moved to ${toStatus.toLowerCase()}`
    );
  }

  const updated = await bookingRepository.updateStatus(bookingId, {
    status: toStatus,
    ...(toStatus === 'CANCELLED'
      ? { cancelledByRole: actor, cancellationReason: extra.cancellationReason }
      : {}),
    ...(toStatus === 'REJECTED' ? { rejectionReason: extra.rejectionReason } : {}),
  });

  logger.info({ bookingId, actor, from: booking.status, to: toStatus }, 'Booking transitioned');

  // Notify whoever DIDN'T perform the action — the actor already knows,
  // since they just did it in their own client.
  const notifyType = TRANSITION_NOTIFICATION_TYPE[toStatus];
  if (notifyType) {
    const otherPartyId = actor === 'CUSTOMER' ? booking.partnerProfile.user.id : booking.userId;
    await notifyUser({
      userId: otherPartyId,
      type: notifyType,
      title: `Booking ${toStatus.toLowerCase()}`,
      body: `Your booking for "${booking.serviceCategoryName}" was ${toStatus.toLowerCase()}.`,
      data: { bookingId },
    });
  }

  return toPublicBooking(updated, userId);
}

export const bookingService = {
  async createBooking(userId: string, input: CreateBookingInput) {
    const profile = await partnerRepository.findById(input.partnerProfileId);
    if (!profile) {
      throw new NotFoundError('Partner not found');
    }

    if (profile.userId === userId) {
      throw new BadRequestError("You can't book your own partner profile");
    }

    const isBlocked = await blockRepository.existsEitherDirection(userId, profile.userId);
    if (isBlocked) {
      // Same 404-not-403 reasoning used elsewhere for blocked interactions —
      // don't confirm anything about the relationship, just decline.
      throw new NotFoundError('Partner not found');
    }

    if (profile.user.verificationStatus !== 'VERIFIED' || !profile.user.isActive || profile.user.deletedAt) {
      throw new BadRequestError('This partner is not currently available for booking');
    }

    if (!profile.isAcceptingBookings) {
      throw new BadRequestError('This partner is not currently accepting bookings');
    }

    const offering = await partnerRepository.findOfferingById(input.offeringId);
    if (!offering || offering.partnerProfileId !== profile.id || !offering.isActive) {
      throw new BadRequestError('That service is not currently offered by this partner');
    }

    const booking = await bookingRepository.create({
      userId,
      partnerProfileId: profile.id,
      offeringId: offering.id,
      serviceCategoryName: offering.serviceCategory.name,
      activityDescription: input.activityDescription,
      scheduledStart: input.scheduledStart,
      scheduledEnd: input.scheduledEnd,
      pricePerHourQuoted: offering.pricePerHour ?? undefined,
      status: 'PENDING',
    });

    logger.info({ bookingId: booking.id, userId, partnerProfileId: profile.id }, 'Booking created');

    await notifyUser({
      userId: profile.userId,
      type: 'BOOKING_REQUESTED',
      title: 'New booking request',
      body: `You have a new request for "${offering.serviceCategory.name}".`,
      data: { bookingId: booking.id },
    });

    return toPublicBooking(booking, userId);
  },

  async getBookingById(userId: string, bookingId: string) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    const actor = resolveBookingActor(
      { userId: booking.userId, partnerUserId: booking.partnerProfile.user.id },
      userId
    );
    if (!actor) {
      throw new NotFoundError('Booking not found');
    }

    return toPublicBooking(booking, userId);
  },

  async listBookings(userId: string, query: ListBookingsQuery) {
    const { items, total } = await bookingRepository.findMany({
      userId,
      as: query.as,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    type BookingListItem = Awaited<ReturnType<typeof bookingRepository.findMany>>['items'][number];

    return {
      items: items.map((b: BookingListItem) => toPublicBooking(b, userId)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  acceptBooking(userId: string, bookingId: string) {
    return transition(userId, bookingId, 'ACCEPTED');
  },

  rejectBooking(userId: string, bookingId: string, input: RejectBookingInput) {
    return transition(userId, bookingId, 'REJECTED', { rejectionReason: input.reason });
  },

  cancelBooking(userId: string, bookingId: string, input: CancelBookingInput) {
    return transition(userId, bookingId, 'CANCELLED', { cancellationReason: input.reason });
  },

  completeBooking(userId: string, bookingId: string) {
    return transition(userId, bookingId, 'COMPLETED');
  },
};
