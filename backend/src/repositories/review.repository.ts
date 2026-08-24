import { prisma } from '../config/prisma';
import type { Prisma } from '@prisma/client';

const reviewWithReviewer = {
  reviewer: { select: { id: true, fullName: true, profileImage: true } },
} satisfies Prisma.ReviewInclude;

export const reviewRepository = {
  findByBookingId(bookingId: string) {
    return prisma.review.findUnique({ where: { bookingId } });
  },

  /**
   * Creates the review and updates the partner's cached rating aggregate in
   * one transaction — a review can never exist without the aggregate
   * reflecting it (or vice versa), even if the process crashes mid-write.
   */
  async createWithRatingUpdate(data: {
    bookingId: string;
    reviewerId: string;
    partnerProfileId: string;
    rating: number;
    comment?: string;
  }) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const review = await tx.review.create({
        data,
        include: reviewWithReviewer,
      });

      const partner = await tx.partnerProfile.findUniqueOrThrow({
        where: { id: data.partnerProfileId },
        select: { averageRating: true, reviewCount: true },
      });

      const newCount = partner.reviewCount + 1;
      const newAverage =
        ((partner.averageRating ?? 0) * partner.reviewCount + data.rating) / newCount;

      await tx.partnerProfile.update({
        where: { id: data.partnerProfileId },
        data: { reviewCount: newCount, averageRating: newAverage },
      });

      return review;
    });
  },

  async findByPartner(partnerProfileId: string, params: { page: number; limit: number }) {
    const { page, limit } = params;
    const where: Prisma.ReviewWhereInput = { partnerProfileId };

    const [items, total] = await prisma.$transaction([
      prisma.review.findMany({
        where,
        include: reviewWithReviewer,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return { items, total };
  },
};
