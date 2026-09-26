import { prisma } from '../config/prisma';
import type { Prisma, DayOfWeek, Gender } from '@prisma/client';

// Shared include shape so the public detail view and the discovery list
// return partners with the same nested data — keeps serializers consistent.
// user is a `select`, not `include: true` — this must never pull
// passwordHash, email, or phoneNumber into a partner-discovery response.
const partnerWithRelations = {
  user: {
    select: {
      id: true,
      fullName: true,
      profileImage: true,
      gender: true,
      verificationStatus: true,
      isActive: true,
      deletedAt: true,
    },
  },
  offerings: { where: { isActive: true }, include: { serviceCategory: true } },
  availability: true,
} satisfies Prisma.PartnerProfileInclude;

export const partnerRepository = {
  findByUserId(userId: string) {
    return prisma.partnerProfile.findUnique({
      where: { userId },
      include: partnerWithRelations,
    });
  },

  findById(id: string) {
    return prisma.partnerProfile.findUnique({
      where: { id },
      include: partnerWithRelations,
    });
  },

  create(data: Prisma.PartnerProfileCreateInput) {
    return prisma.partnerProfile.create({ data, include: partnerWithRelations });
  },

  /**
   * Creating a partner profile is what turns a USER into a PARTNER — both
   * writes happen in one transaction so a crash between them can't leave a
   * partner profile attached to a still-USER-role account (or vice versa).
   */
  async createProfileAndPromoteUser(
    userId: string,
    data: Omit<Prisma.PartnerProfileUncheckedCreateInput, 'userId'>
  ) {
    const [profile] = await prisma.$transaction([
      prisma.partnerProfile.create({
        data: { ...data, userId },
        include: partnerWithRelations,
      }),
      prisma.user.update({ where: { id: userId }, data: { role: 'PARTNER' } }),
    ]);
    return profile;
  },

  update(id: string, data: Prisma.PartnerProfileUpdateInput) {
    return prisma.partnerProfile.update({
      where: { id },
      data,
      include: partnerWithRelations,
    });
  },

  async search(params: {
    page: number;
    limit: number;
    city?: string;
    gender?: Gender;
    serviceCategorySlug?: string;
    dayOfWeek?: DayOfWeek;
    search?: string;
  }) {
    const { page, limit, city, gender, serviceCategorySlug, dayOfWeek, search } = params;

    // Public discovery only ever surfaces partners who are verified, active,
    // not soft-deleted, and currently accepting bookings — unverified or
    // deactivated partners simply don't appear, regardless of filters.
    const where: Prisma.PartnerProfileWhereInput = {
      isAcceptingBookings: true,
      user: {
        isActive: true,
        deletedAt: null,
        verificationStatus: 'VERIFIED',
        ...(gender ? { gender } : {}),
      },
      ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
      ...(serviceCategorySlug
        ? { offerings: { some: { isActive: true, serviceCategory: { slug: serviceCategorySlug } } } }
        : {}),
      ...(dayOfWeek ? { availability: { some: { dayOfWeek } } } : {}),
      ...(search
        ? {
            OR: [
              { headline: { contains: search, mode: 'insensitive' } },
              { bio: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.partnerProfile.findMany({
        where,
        include: partnerWithRelations,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.partnerProfile.count({ where }),
    ]);

    return { items, total };
  },

  addOffering(data: Prisma.PartnerServiceOfferingUncheckedCreateInput) {
    return prisma.partnerServiceOffering.create({ data, include: { serviceCategory: true } });
  },

  removeOffering(id: string, partnerProfileId: string) {
    // Scoped to partnerProfileId in the where clause so a partner can only
    // ever delete their own offerings, never guess another partner's row id.
    return prisma.partnerServiceOffering.deleteMany({ where: { id, partnerProfileId } });
  },

  findOfferingByCategoryId(partnerProfileId: string, serviceCategoryId: string) {
    return prisma.partnerServiceOffering.findUnique({
      where: { partnerProfileId_serviceCategoryId: { partnerProfileId, serviceCategoryId } },
    });
  },

  findOfferingById(offeringId: string) {
    return prisma.partnerServiceOffering.findUnique({
      where: { id: offeringId },
      include: { serviceCategory: true },
    });
  },

  replaceAvailability(
    partnerProfileId: string,
    slots: Array<{ dayOfWeek: DayOfWeek; startTime: string; endTime: string }>
  ) {
    return prisma.$transaction([
      prisma.partnerAvailability.deleteMany({ where: { partnerProfileId } }),
      prisma.partnerAvailability.createMany({
        data: slots.map((slot) => ({ ...slot, partnerProfileId })),
      }),
    ]);
  },

  /**
   * Admin listing — unlike the public `search()` above, this is NOT
   * restricted to verified/active/accepting partners; admins need to see
   * pending and rejected profiles too in order to review them. The nested
   * user select adds email/phoneNumber on top of the public-safe fields,
   * since an admin legitimately needs contact info — this include is only
   * ever used behind the ADMIN-only routes in admin.routes.ts.
   */
  async adminSearch(params: {
    page: number;
    limit: number;
    verificationStatus?: Prisma.UserWhereInput['verificationStatus'];
    city?: string;
  }) {
    const { page, limit, verificationStatus, city } = params;

    const where: Prisma.PartnerProfileWhereInput = {
      ...(verificationStatus ? { user: { verificationStatus } } : {}),
      ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
    };

    const include = {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
          gender: true,
          verificationStatus: true,
          isActive: true,
        },
      },
      offerings: { include: { serviceCategory: true } },
      availability: true,
    } satisfies Prisma.PartnerProfileInclude;

    const [items, total] = await prisma.$transaction([
      prisma.partnerProfile.findMany({
        where,
        include,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.partnerProfile.count({ where }),
    ]);

    return { items, total };
  },
};
