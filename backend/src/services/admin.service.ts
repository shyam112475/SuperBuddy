import { userRepository } from '../repositories/user.repository';
import { partnerRepository } from '../repositories/partner.repository';
import { bookingRepository } from '../repositories/booking.repository';
import { paymentRepository } from '../repositories/payment.repository';
import { sosRepository } from '../repositories/sos.repository';
import { reportRepository } from '../repositories/report.repository';
import { toPublicUser, toPublicBooking, toPublicPayment } from '../utils/serializers';
import { notifyUser } from './notification.service';
import { invalidatePartnerDetailCache } from './partner.service';
import { NotFoundError } from '../utils/AppError';
import { logger } from '../config/logger';
import type {
  AdminListBookingsQuery,
  AdminListPartnersQuery,
  AdminListPaymentsQuery,
  AdminListReportsQuery,
  AdminListSOSQuery,
  AdminListUsersQuery,
  UpdateReportStatusInput,
  VerifyPartnerInput,
} from '../validators/admin.validators';

function paginate(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

/**
 * Admin needs to see contact info (email/phone) that the public partner
 * serializer deliberately withholds — this is a distinct, admin-only shape
 * rather than a variant of toPublicPartner, so there's no risk of the
 * public discovery endpoint ever accidentally picking up the extra fields.
 */
function toAdminPartner(profile: {
  id: string;
  headline: string;
  bio: string;
  city: string;
  area: string | null;
  isAcceptingBookings: boolean;
  averageRating: number | null;
  reviewCount: number;
  createdAt: Date;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    profileImage: string | null;
    gender: string | null;
    verificationStatus: string;
    isActive: boolean;
  };
  offerings: Array<{
    id: string;
    description: string | null;
    isActive: boolean;
    serviceCategory: { name: string; slug: string };
  }>;
  availability: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
}) {
  return {
    id: profile.id,
    headline: profile.headline,
    bio: profile.bio,
    city: profile.city,
    area: profile.area,
    isAcceptingBookings: profile.isAcceptingBookings,
    averageRating: profile.averageRating,
    reviewCount: profile.reviewCount,
    createdAt: profile.createdAt,
    partner: profile.user,
    services: profile.offerings.map((o) => ({
      id: o.id,
      description: o.description,
      isActive: o.isActive,
      category: o.serviceCategory,
    })),
    availability: profile.availability,
  };
}

export const adminService = {
  async getDashboardStats() {
    const [
      { totalUsers, totalPartners, totalAdmins },
      bookingsByStatus,
      totalRevenue,
      activeSOSCount,
      openReportsCount,
    ] = await Promise.all([
      userRepository.countByRole(),
      bookingRepository.countByStatus(),
      paymentRepository.sumPaidAmount(),
      sosRepository.countActive(),
      reportRepository.countOpen(),
    ]);

    return {
      users: { total: totalUsers, partners: totalPartners, admins: totalAdmins },
      bookings: bookingsByStatus,
      revenue: { totalPaid: totalRevenue, currency: 'INR' },
      safety: { activeSOSAlerts: activeSOSCount, openReports: openReportsCount },
    };
  },

  async listUsers(query: AdminListUsersQuery) {
    const { items, total } = await userRepository.adminSearch(query);
    return {
      items: items.map(toPublicUser),
      pagination: paginate(query.page, query.limit, total),
    };
  },

  async listPartners(query: AdminListPartnersQuery) {
    const { items, total } = await partnerRepository.adminSearch(query);
    return {
      items: items.map(toAdminPartner),
      pagination: paginate(query.page, query.limit, total),
    };
  },

  async verifyPartner(adminUserId: string, partnerProfileId: string, input: VerifyPartnerInput) {
    const profile = await partnerRepository.findById(partnerProfileId);
    if (!profile) {
      throw new NotFoundError('Partner not found');
    }

    const updatedUser = await userRepository.update(profile.userId, {
      verificationStatus: input.status,
    });

    logger.info(
      { adminUserId, partnerProfileId, status: input.status },
      'Partner verification status updated'
    );
    // Verification status is exactly what gates public visibility in
    // getPublicProfile — a stale cached "not found" or stale cached profile
    // after a status flip would be a real correctness bug, not just a
    // freshness nitpick.
    await invalidatePartnerDetailCache(partnerProfileId);

    await notifyUser({
      userId: profile.userId,
      type: 'VERIFICATION_UPDATE',
      title: input.status === 'VERIFIED' ? "You're verified!" : 'Verification update',
      body:
        input.status === 'VERIFIED'
          ? 'Your companion profile is now verified and visible to everyone.'
          : `Your verification was not approved.${input.note ? ` ${input.note}` : ''}`,
      data: { partnerProfileId },
    });

    return toPublicUser(updatedUser);
  },

  async listBookings(adminUserId: string, query: AdminListBookingsQuery) {
    const { items, total } = await bookingRepository.adminList(query);
    return {
      // viewerRole is not meaningful for an admin (they're not a party to
      // any of these bookings) — passed through for shape consistency with
      // the customer/partner booking views, but the admin UI doesn't use it.
      items: items.map((b: Parameters<typeof toPublicBooking>[0]) => toPublicBooking(b, adminUserId)),
      pagination: paginate(query.page, query.limit, total),
    };
  },

  async listPayments(query: AdminListPaymentsQuery) {
    const { items, total } = await paymentRepository.adminList(query);
    return {
      items: items.map(toPublicPayment),
      pagination: paginate(query.page, query.limit, total),
    };
  },

  async listSOSAlerts(query: AdminListSOSQuery) {
    const { items, total } = await sosRepository.adminList(query);
    return {
      items: items.map(
        (alert: {
          id: string;
          status: string;
          latitude: number;
          longitude: number;
          description: string | null;
          resolvedAt: Date | null;
          resolutionNote: string | null;
          createdAt: Date;
          user: { id: string; fullName: string; profileImage: string | null };
        }) => ({
          id: alert.id,
          status: alert.status,
          latitude: alert.latitude,
          longitude: alert.longitude,
          description: alert.description,
          resolvedAt: alert.resolvedAt,
          resolutionNote: alert.resolutionNote,
          createdAt: alert.createdAt,
          triggeredBy: alert.user,
        })
      ),
      pagination: paginate(query.page, query.limit, total),
    };
  },

  async listReports(query: AdminListReportsQuery) {
    const { items, total } = await reportRepository.adminList(query);
    return {
      items: items.map(
        (r: {
          id: string;
          reason: string;
          description: string;
          status: string;
          resolutionNote: string | null;
          resolvedAt: Date | null;
          createdAt: Date;
          reporter: { id: string; fullName: string; profileImage: string | null };
          reportedUser: { id: string; fullName: string; profileImage: string | null };
        }) => ({
          id: r.id,
          reason: r.reason,
          description: r.description,
          status: r.status,
          resolutionNote: r.resolutionNote,
          resolvedAt: r.resolvedAt,
          createdAt: r.createdAt,
          reporter: r.reporter,
          reportedUser: r.reportedUser,
        })
      ),
      pagination: paginate(query.page, query.limit, total),
    };
  },

  async updateReportStatus(adminUserId: string, reportId: string, input: UpdateReportStatusInput) {
    const report = await reportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError('Report not found');
    }

    const updated = await reportRepository.updateStatus(
      reportId,
      input.status,
      adminUserId,
      input.note
    );

    logger.info({ adminUserId, reportId, status: input.status }, 'Report status updated');

    return {
      id: updated.id,
      status: updated.status,
      resolutionNote: updated.resolutionNote,
      resolvedAt: updated.resolvedAt,
    };
  },
};
