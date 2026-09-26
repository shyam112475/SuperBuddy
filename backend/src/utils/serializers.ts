import type {
  User,
  PartnerProfile,
  PartnerServiceOffering,
  ServiceCategory,
  PartnerAvailability,
  Booking,
  Payment,
  Message,
  Review,
} from '@prisma/client';
import type { PublicUser } from '../types/auth.types';

/** Strips passwordHash (and anything else sensitive) before a User ever reaches a response. */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    profileImage: user.profileImage,
    verificationStatus: user.verificationStatus,
    isActive: user.isActive,
    emergencyContactName: user.emergencyContactName,
    emergencyContactPhone: user.emergencyContactPhone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

type PartnerProfileWithRelations = PartnerProfile & {
  user: Pick<User, 'id' | 'fullName' | 'profileImage' | 'gender' | 'verificationStatus'>;
  offerings: (PartnerServiceOffering & { serviceCategory: ServiceCategory })[];
  availability: PartnerAvailability[];
};

/**
 * Shapes a partner profile for API responses. The `user` relation was
 * already fetched via a restricted `select` (see partner.repository.ts) so
 * there's no passwordHash/email/phoneNumber to accidentally leak here —
 * this just organizes the response, it isn't the only safety net.
 */
export function toPublicPartner(profile: PartnerProfileWithRelations) {
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
    partner: {
      id: profile.user.id,
      fullName: profile.user.fullName,
      profileImage: profile.user.profileImage,
      gender: profile.user.gender,
      verificationStatus: profile.user.verificationStatus,
    },
    services: profile.offerings.map((offering: PartnerServiceOffering & { serviceCategory: ServiceCategory }) => ({
      id: offering.id,
      category: {
        id: offering.serviceCategory.id,
        name: offering.serviceCategory.name,
        slug: offering.serviceCategory.slug,
      },
      description: offering.description,
      pricePerHour: offering.pricePerHour ? Number(offering.pricePerHour) : null,
    })),
    availability: profile.availability.map((slot: PartnerAvailability) => ({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
  };
}

type BookingWithRelations = Booking & {
  user: Pick<User, 'id' | 'fullName' | 'profileImage'>;
  partnerProfile: Pick<PartnerProfile, 'id' | 'headline' | 'city'> & {
    user: Pick<User, 'id' | 'fullName' | 'profileImage'>;
  };
  offering:
    | (Pick<PartnerServiceOffering, 'id' | 'description'> & {
        serviceCategory: Pick<ServiceCategory, 'name' | 'slug'>;
      })
    | null;
  review: { id: string } | null;
};

/**
 * Shapes a booking for API responses and tags it with which side of the
 * booking the requesting user is on. viewerRole is derived fresh from
 * (booking.userId vs viewerUserId) on every call — it's a display hint for
 * the frontend, never itself used for authorization (see booking.service.ts).
 */
export function toPublicBooking(booking: BookingWithRelations, viewerUserId: string) {
  return {
    id: booking.id,
    status: booking.status,
    activityDescription: booking.activityDescription,
    serviceCategoryName: booking.serviceCategoryName,
    scheduledStart: booking.scheduledStart,
    scheduledEnd: booking.scheduledEnd,
    pricePerHourQuoted: booking.pricePerHourQuoted ? Number(booking.pricePerHourQuoted) : null,
    cancelledByRole: booking.cancelledByRole,
    cancellationReason: booking.cancellationReason,
    rejectionReason: booking.rejectionReason,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    hasReview: Boolean(booking.review),
    viewerRole: booking.userId === viewerUserId ? 'CUSTOMER' : 'PARTNER',
    customer: {
      id: booking.user.id,
      fullName: booking.user.fullName,
      profileImage: booking.user.profileImage,
    },
    partner: {
      partnerProfileId: booking.partnerProfile.id,
      headline: booking.partnerProfile.headline,
      city: booking.partnerProfile.city,
      id: booking.partnerProfile.user.id,
      fullName: booking.partnerProfile.user.fullName,
      profileImage: booking.partnerProfile.user.profileImage,
    },
    offering: booking.offering
      ? {
          id: booking.offering.id,
          description: booking.offering.description,
          category: booking.offering.serviceCategory,
        }
      : null,
  };
}

/**
 * Deliberately omits razorpaySignature — that's a verification artifact,
 * not something the client ever needs back, and no reason to return it.
 */
export function toPublicPayment(payment: Payment) {
  return {
    id: payment.id,
    bookingId: payment.bookingId,
    amount: Number(payment.amount),
    currency: payment.currency,
    status: payment.status,
    razorpayOrderId: payment.razorpayOrderId,
    razorpayPaymentId: payment.razorpayPaymentId,
    failureReason: payment.failureReason,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
}

type MessageWithSender = Message & {
  sender: Pick<User, 'id' | 'fullName' | 'profileImage'>;
};

export function toPublicMessage(message: MessageWithSender) {
  return {
    id: message.id,
    bookingId: message.bookingId,
    content: message.content,
    readAt: message.readAt,
    createdAt: message.createdAt,
    sender: {
      id: message.sender.id,
      fullName: message.sender.fullName,
      profileImage: message.sender.profileImage,
    },
  };
}

type ReviewWithReviewer = Review & {
  reviewer: Pick<User, 'id' | 'fullName' | 'profileImage'>;
};

export function toPublicReview(review: ReviewWithReviewer) {
  return {
    id: review.id,
    bookingId: review.bookingId,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    reviewer: {
      id: review.reviewer.id,
      fullName: review.reviewer.fullName,
      profileImage: review.reviewer.profileImage,
    },
  };
}
