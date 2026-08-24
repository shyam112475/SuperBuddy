import { prisma } from '../config/prisma';
import type { Prisma, ReportStatus } from '@prisma/client';

export const reportRepository = {
  create(data: Prisma.ReportUncheckedCreateInput) {
    return prisma.report.create({ data });
  },

  findMyReports(reporterId: string) {
    return prisma.report.findMany({
      where: { reporterId },
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.report.findUnique({ where: { id } });
  },

  /** Admin review queue. */
  async adminList(params: { page: number; limit: number; status?: ReportStatus }) {
    const { page, limit, status } = params;
    const where: Prisma.ReportWhereInput = status ? { status } : {};

    const include = {
      reporter: { select: { id: true, fullName: true, profileImage: true } },
      reportedUser: { select: { id: true, fullName: true, profileImage: true } },
    } satisfies Prisma.ReportInclude;

    const [items, total] = await prisma.$transaction([
      prisma.report.findMany({
        where,
        include,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return { items, total };
  },

  updateStatus(
    id: string,
    status: ReportStatus,
    resolvedByAdminId: string,
    resolutionNote?: string
  ) {
    return prisma.report.update({
      where: { id },
      data: { status, resolvedByAdminId, resolutionNote, resolvedAt: new Date() },
    });
  },

  countOpen() {
    return prisma.report.count({ where: { status: 'OPEN' } });
  },
};
