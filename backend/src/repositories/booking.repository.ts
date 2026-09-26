import { prisma } from '../config/prisma';
import type { Prisma, BookingStatus } from '@prisma/client';

// Safe, minimal nested selects — never pull passwordHash/email/phoneNumber
// into a booking response. Bookings show both sides (customer + partner),
// so this matters on both relations, not just one.
const bookingWithRelations = {
  user: {
    select: { id: true, fullName: true, profileImage: true },
  },
  partnerProfile: {
    select: {
      id: true,
      headline: true,
      city: true,
      user: { select: { id: true, fullName: true, profileImage: true } },
    },
  },
  offering: {
    select: { id: true, description: true, serviceCategory: { select: { name: true, slug: true } } },
  },
  review: { select: { id: true } },
} satisfies Prisma.BookingInclude;

export const bookingRepository = {
  create(data: Prisma.BookingUncheckedCreateInput) {
    return prisma.booking.create({ data, include: bookingWithRelations });
  },

  findById(id: string) {
    return prisma.booking.findUnique({ where: { id }, include: bookingWithRelations });
  },

  async findMany(params: {
    userId: string;
    as?: 'customer' | 'partner';
    status?: BookingStatus;
    page: number;
    limit: number;
  }) {
    const { userId, as, status, page, limit } = params;

    // Default (no `as` filter) returns bookings where the caller is either
    // side — the customer who requested it, or the partner who received it.
    const perspectiveFilter: Prisma.BookingWhereInput =
      as === 'customer'
        ? { userId }
        : as === 'partner'
          ? { partnerProfile: { userId } }
          : { OR: [{ userId }, { partnerProfile: { userId } }] };

    const where: Prisma.BookingWhereInput = {
      ...perspectiveFilter,
      ...(status ? { status } : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        include: bookingWithRelations,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return { items, total };
  },

  updateStatus(id: string, data: Prisma.BookingUpdateInput) {
    return prisma.booking.update({ where: { id }, data, include: bookingWithRelations });
  },

  /**
   * Booking ids where the user is a participant (either side) — used purely
   * to auto-join Socket.IO rooms on connect (see sockets/index.ts), not for
   * any authorization decision. Every real authorization check re-resolves
   * participancy fresh per-action in chat.service.ts / booking.service.ts.
   */
  async findParticipantBookingIds(userId: string): Promise<string[]> {
    const bookings = await prisma.booking.findMany({
      where: { OR: [{ userId }, { partnerProfile: { userId } }] },
      select: { id: true },
    });
    return bookings.map((b: { id: string }) => b.id);
  },

  /** Minimal fetch for authorization checks that don't need the full nested shape. */
  findParticipants(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      select: { id: true, userId: true, partnerProfile: { select: { userId: true } } },
    });
  },

  /** Admin monitoring — every booking, not scoped to a participant. */
  async adminList(params: { page: number; limit: number; status?: BookingStatus }) {
    const { page, limit, status } = params;
    const where: Prisma.BookingWhereInput = status ? { status } : {};

    const [items, total] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        include: bookingWithRelations,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return { items, total };
  },

  async countByStatus() {
    const counts = await prisma.booking.groupBy({ by: ['status'], _count: true });
    return counts.reduce(
      (acc: Record<string, number>, row: { status: string; _count: number }) => {
        acc[row.status] = row._count;
        return acc;
      },
      {} as Record<string, number>
    );
  },
};
