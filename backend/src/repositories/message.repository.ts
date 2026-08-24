import { prisma } from '../config/prisma';
import type { Prisma } from '@prisma/client';

const messageWithSender = {
  sender: { select: { id: true, fullName: true, profileImage: true } },
} satisfies Prisma.MessageInclude;

export const messageRepository = {
  create(data: Prisma.MessageUncheckedCreateInput) {
    return prisma.message.create({ data, include: messageWithSender });
  },

  async findByBooking(bookingId: string, params: { page: number; limit: number }) {
    const { page, limit } = params;
    const where: Prisma.MessageWhereInput = { bookingId };

    const [items, total] = await prisma.$transaction([
      prisma.message.findMany({
        where,
        include: messageWithSender,
        // Oldest-first within the page — natural reading order for chat
        // history, unlike most list views in this app which are newest-first.
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({ where }),
    ]);

    return { items, total };
  },

  markReadForRecipient(bookingId: string, recipientId: string) {
    // "Read" means the recipient (not the sender) has seen messages sent by
    // the other party — never marks the reader's own outgoing messages.
    return prisma.message.updateMany({
      where: { bookingId, senderId: { not: recipientId }, readAt: null },
      data: { readAt: new Date() },
    });
  },
};
