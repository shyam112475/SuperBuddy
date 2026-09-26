import type { BookingStatus } from '@prisma/client';

export type BookingActor = 'CUSTOMER' | 'PARTNER';

/**
 * The complete, explicit booking state machine (Master Development Prompt
 * §19). Any (fromStatus, toStatus) pair not listed here is simply not
 * allowed, regardless of who's asking — there is no code path that can
 * reach an unlisted transition. Extracted from booking.service.ts as its
 * own pure module (no I/O, no Prisma import) so it's independently unit
 * testable without a database — see tests/unit/bookingStateMachine.test.ts.
 */
export const ALLOWED_BOOKING_TRANSITIONS: Partial<
  Record<BookingStatus, Partial<Record<BookingStatus, BookingActor[]>>>
> = {
  PENDING: {
    ACCEPTED: ['PARTNER'],
    REJECTED: ['PARTNER'],
    CANCELLED: ['CUSTOMER'],
  },
  ACCEPTED: {
    COMPLETED: ['PARTNER'],
    CANCELLED: ['CUSTOMER', 'PARTNER'],
  },
  REJECTED: {},
  CANCELLED: {},
  COMPLETED: {},
};

/**
 * Returns whether `actor` may move a booking from `fromStatus` to
 * `toStatus`. Pure function — the caller is responsible for resolving who
 * the actor actually is (see resolveBookingActor below) and for actually
 * performing the transition; this only answers "is this allowed".
 */
export function canTransitionBooking(
  fromStatus: BookingStatus,
  toStatus: BookingStatus,
  actor: BookingActor
): boolean {
  const allowedActors = ALLOWED_BOOKING_TRANSITIONS[fromStatus]?.[toStatus];
  return Boolean(allowedActors?.includes(actor));
}

/**
 * Resolves which side of a booking a given user is on, or null if they're
 * not a participant at all. Pure function over plain data — no Prisma
 * types required, so callers can pass either a full Prisma booking or a
 * lightweight { userId, partnerUserId } shape.
 */
export function resolveBookingActor(
  booking: { userId: string; partnerUserId: string },
  userId: string
): BookingActor | null {
  if (booking.userId === userId) return 'CUSTOMER';
  if (booking.partnerUserId === userId) return 'PARTNER';
  return null;
}
