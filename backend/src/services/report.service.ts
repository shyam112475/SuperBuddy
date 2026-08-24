import { reportRepository } from '../repositories/report.repository';
import { userRepository } from '../repositories/user.repository';
import { notifyAdmins } from './notification.service';
import { BadRequestError, NotFoundError } from '../utils/AppError';
import { logger } from '../config/logger';
import type { CreateReportInput } from '../validators/report.validators';

export const reportService = {
  async createReport(reporterId: string, input: CreateReportInput) {
    if (input.reportedUserId === reporterId) {
      throw new BadRequestError("You can't report yourself");
    }

    const reportedUser = await userRepository.findById(input.reportedUserId);
    if (!reportedUser || reportedUser.deletedAt) {
      throw new NotFoundError('User not found');
    }

    const report = await reportRepository.create({
      reporterId,
      reportedUserId: input.reportedUserId,
      bookingId: input.bookingId,
      reason: input.reason,
      description: input.description,
      status: 'OPEN',
    });

    logger.warn(
      { reportId: report.id, reporterId, reportedUserId: input.reportedUserId, reason: input.reason },
      'Report filed'
    );

    // Admins get a queue entry to review (full triage tooling arrives with
    // the Phase 10 admin dashboard) — the reported user is never notified,
    // to avoid tipping them off in a way that could enable retaliation.
    await notifyAdmins({
      type: 'SYSTEM',
      title: 'New report filed',
      body: `A ${input.reason.toLowerCase().replace(/_/g, ' ')} report was filed against a user.`,
      data: { reportId: report.id, reportedUserId: input.reportedUserId },
    });

    return {
      id: report.id,
      reason: report.reason,
      description: report.description,
      status: report.status,
      createdAt: report.createdAt,
    };
  },

  async listMyReports(reporterId: string) {
    const reports = await reportRepository.findMyReports(reporterId);
    return reports.map((r: (typeof reports)[number]) => ({
      id: r.id,
      reportedUserId: r.reportedUserId,
      reason: r.reason,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt,
    }));
  },
};
