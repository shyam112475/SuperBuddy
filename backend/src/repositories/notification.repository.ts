import { prisma } from '../config/prisma';
import type { Prisma, NotificationType } from '@prisma/client';

export const notificationRepository = {
  create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Prisma.InputJsonValue;
  }) {
    return prisma.notification.create({ data });
  },

  async findMany(params: { userId: string; page: number; limit: number; unreadOnly?: boolean }) {
    const { userId, page, limit, unreadOnly } = params;
    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(unreadOnly ? { readAt: null } : {}),
    };

    const [items, total, unreadCount] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, readAt: null } }),
    ]);

    return { items, total, unreadCount };
  },

  markRead(id: string, userId: string) {
    // Scoped to userId so a notification id can never be marked read on
    // behalf of someone else — matches the same ownership pattern used for
    // offerings/bookings elsewhere in the codebase.
    return prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    });
  },

  markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  },
};
