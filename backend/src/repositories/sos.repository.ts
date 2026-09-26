import { prisma } from '../config/prisma';
import type { Prisma, SOSStatus } from '@prisma/client';

export const sosRepository = {
  create(data: Prisma.SOSAlertUncheckedCreateInput) {
    return prisma.sOSAlert.create({ data });
  },

  findById(id: string) {
    return prisma.sOSAlert.findUnique({
      where: { id },
      include: {
        booking: {
          select: {
            id: true,
            userId: true,
            partnerProfile: { select: { userId: true } },
          },
        },
      },
    });
  },

  resolve(id: string, resolvedByUserId: string, status: SOSStatus, resolutionNote?: string) {
    return prisma.sOSAlert.update({
      where: { id },
      data: { status, resolvedAt: new Date(), resolvedByUserId, resolutionNote },
    });
  },

  /** Admin monitoring — every alert, not scoped to a participant. */
  async adminList(params: { page: number; limit: number; status?: SOSStatus }) {
    const { page, limit, status } = params;
    const where: Prisma.SOSAlertWhereInput = status ? { status } : {};

    const [items, total] = await prisma.$transaction([
      prisma.sOSAlert.findMany({
        where,
        include: { user: { select: { id: true, fullName: true, profileImage: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sOSAlert.count({ where }),
    ]);

    return { items, total };
  },

  countActive() {
    return prisma.sOSAlert.count({ where: { status: 'ACTIVE' } });
  },
};
