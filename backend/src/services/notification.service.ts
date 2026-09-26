import type { NotificationType } from '@prisma/client';
import { notificationRepository } from '../repositories/notification.repository';
import { userRepository } from '../repositories/user.repository';
import { pushProvider } from './notifications';
import { emitToUser } from '../sockets/emitter';
import { logger } from '../config/logger';

/**
 * The single entry point every other service uses to notify a user —
 * booking.service.ts, payment.service.ts, and chat.service.ts all call
 * this rather than touching the Notification table or a push provider
 * directly. Three things always happen, in order: persist (source of
 * truth, survives the user being offline), push (best-effort, never blocks
 * or fails the caller), real-time socket event (best-effort, no-op if
 * they're not connected).
 */
export async function notifyUser(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  const { userId, type, title, body, data } = params;

  const notification = await notificationRepository.create({ userId, type, title, body, data });

  emitToUser(userId, 'notification:new', notification);

  // Push failures are logged, never thrown — the in-app notification above
  // already succeeded, and a missing push shouldn't roll back or fail
  // whatever business action triggered it (e.g. accepting a booking).
  pushProvider.send({ userId, title, body, data }).catch((err) => {
    logger.warn({ err, userId }, 'Push notification failed to send');
  });

  return notification;
}

/**
 * Fans a notification out to every active admin — used for platform-wide
 * events like an SOS alert or (later) a new report. Each admin gets their
 * own persisted Notification row via notifyUser, so read-state is tracked
 * per-admin rather than as one shared record.
 */
export async function notifyAdmins(params: {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  const adminIds = await userRepository.findAdminIds();
  await Promise.all(adminIds.map((userId) => notifyUser({ userId, ...params })));
}

export const notificationService = {
  async list(userId: string, params: { page: number; limit: number; unreadOnly?: boolean }) {
    const { items, total, unreadCount } = await notificationRepository.findMany({
      userId,
      ...params,
    });

    return {
      items,
      unreadCount,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  },

  async markRead(userId: string, notificationId: string) {
    await notificationRepository.markRead(notificationId, userId);
  },

  async markAllRead(userId: string) {
    await notificationRepository.markAllRead(userId);
  },
};
