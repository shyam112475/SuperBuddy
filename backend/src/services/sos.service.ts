import { sosRepository } from '../repositories/sos.repository';
import { userRepository } from '../repositories/user.repository';
import { bookingRepository } from '../repositories/booking.repository';
import { emergencyProvider } from './emergency';
import { notifyUser, notifyAdmins } from './notification.service';
import { ForbiddenError, NotFoundError } from '../utils/AppError';
import { logger } from '../config/logger';
import type { CreateSOSAlertInput, ResolveSOSAlertInput } from '../validators/sos.validators';

function toPublicSOSAlert(alert: {
  id: string;
  userId: string;
  bookingId: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  status: string;
  resolvedAt: Date | null;
  resolvedByUserId: string | null;
  resolutionNote: string | null;
  createdAt: Date;
}) {
  return {
    id: alert.id,
    bookingId: alert.bookingId,
    latitude: alert.latitude,
    longitude: alert.longitude,
    description: alert.description,
    status: alert.status,
    resolvedAt: alert.resolvedAt,
    resolutionNote: alert.resolutionNote,
    createdAt: alert.createdAt,
  };
}

/**
 * Who is allowed to see this alert at all — the trigger, the other
 * participant on the related booking (if any), or an admin. Every read
 * path (getById, resolve) goes through this; there is no way to fetch an
 * SOS alert that bypasses it.
 */
async function assertCanAccess(
  alert: { userId: string; bookingId: string | null; booking: { userId: string; partnerProfile: { userId: string } } | null },
  requestingUserId: string,
  requestingUserRole: string
) {
  if (requestingUserRole === 'ADMIN') return;
  if (alert.userId === requestingUserId) return;
  if (
    alert.booking &&
    (alert.booking.userId === requestingUserId || alert.booking.partnerProfile.userId === requestingUserId)
  ) {
    return;
  }
  // 404, not 403 — an unrelated user should never learn an SOS alert with
  // this id even exists, let alone anything about it.
  throw new NotFoundError('SOS alert not found');
}

export const sosService = {
  async createAlert(userId: string, input: CreateSOSAlertInput) {
    if (input.bookingId) {
      const participants = await bookingRepository.findParticipants(input.bookingId);
      const isParticipant =
        participants &&
        (participants.userId === userId || participants.partnerProfile.userId === userId);
      if (!isParticipant) {
        // Can't tie an SOS alert to a booking you're not part of.
        throw new NotFoundError('Booking not found');
      }
    }

    const alert = await sosRepository.create({
      userId,
      bookingId: input.bookingId,
      latitude: input.latitude,
      longitude: input.longitude,
      description: input.description,
      status: 'ACTIVE',
    });

    logger.warn({ sosAlertId: alert.id, userId, bookingId: input.bookingId }, 'SOS alert triggered');

    const triggeringUser = await userRepository.findById(userId);

    // Three independent, best-effort alert paths — a failure in one should
    // never prevent the others from firing, since this is a safety feature.
    await Promise.allSettled([
      notifyAdmins({
        type: 'SOS_ALERT',
        title: 'SOS alert triggered',
        body: `${triggeringUser?.fullName ?? 'A user'} triggered an SOS alert.`,
        data: { sosAlertId: alert.id, userId },
      }),
      input.bookingId
        ? (async () => {
            const participants = await bookingRepository.findParticipants(input.bookingId!);
            if (!participants) return;
            const otherPartyId =
              participants.userId === userId ? participants.partnerProfile.userId : participants.userId;
            await notifyUser({
              userId: otherPartyId,
              type: 'SOS_ALERT',
              title: 'Safety alert',
              body: 'The other person on your booking has triggered an SOS alert.',
              data: { sosAlertId: alert.id, bookingId: input.bookingId! },
            });
          })()
        : Promise.resolve(),
      triggeringUser?.emergencyContactName && triggeringUser?.emergencyContactPhone
        ? emergencyProvider.notifyEmergencyContact(
            {
              sosAlertId: alert.id,
              triggeredByUserId: userId,
              triggeredByName: triggeringUser.fullName,
              latitude: input.latitude,
              longitude: input.longitude,
              description: input.description ?? null,
              bookingId: input.bookingId ?? null,
            },
            { name: triggeringUser.emergencyContactName, phone: triggeringUser.emergencyContactPhone }
          )
        : Promise.resolve(),
    ]);

    return toPublicSOSAlert(alert);
  },

  async getAlertById(userId: string, role: string, alertId: string) {
    const alert = await sosRepository.findById(alertId);
    if (!alert) {
      throw new NotFoundError('SOS alert not found');
    }
    await assertCanAccess(alert, userId, role);
    return toPublicSOSAlert(alert);
  },

  async resolveAlert(userId: string, role: string, alertId: string, input: ResolveSOSAlertInput) {
    const alert = await sosRepository.findById(alertId);
    if (!alert) {
      throw new NotFoundError('SOS alert not found');
    }
    await assertCanAccess(alert, userId, role);

    // Only the person who triggered it, or an admin, can resolve it — the
    // other booking participant can SEE it (they may need to respond) but
    // can't unilaterally mark someone else's emergency as over.
    if (alert.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenError('Only the person who triggered this alert or an admin can resolve it');
    }

    if (alert.status !== 'ACTIVE') {
      throw new ForbiddenError('This alert has already been resolved');
    }

    const resolved = await sosRepository.resolve(alertId, userId, input.status, input.note);
    logger.info({ sosAlertId: alertId, resolvedBy: userId, status: input.status }, 'SOS alert resolved');
    return toPublicSOSAlert(resolved);
  },
};
