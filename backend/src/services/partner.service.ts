import { partnerRepository } from '../repositories/partner.repository';
import { serviceCategoryRepository } from '../repositories/serviceCategory.repository';
import { toPublicPartner } from '../utils/serializers';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/AppError';
import { logger } from '../config/logger';
import type {
  AddServiceOfferingInput,
  CreatePartnerProfileInput,
  DiscoverPartnersQuery,
  SetAvailabilityInput,
  UpdatePartnerProfileInput,
} from '../validators/partner.validators';

export const partnerService = {
  async createProfile(userId: string, input: CreatePartnerProfileInput) {
    const existing = await partnerRepository.findByUserId(userId);
    if (existing) {
      throw new ConflictError('You already have a partner profile');
    }

    const profile = await partnerRepository.createProfileAndPromoteUser(userId, {
      headline: input.headline,
      bio: input.bio,
      city: input.city,
      area: input.area,
    });

    logger.info({ userId }, 'Partner profile created — user promoted to PARTNER role');
    return toPublicPartner(profile);
  },

  async getMyProfile(userId: string) {
    const profile = await partnerRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError('You do not have a partner profile yet');
    }
    return toPublicPartner(profile);
  },

  async updateMyProfile(userId: string, input: UpdatePartnerProfileInput) {
    const profile = await partnerRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError('You do not have a partner profile yet');
    }

    const updated = await partnerRepository.update(profile.id, {
      headline: input.headline,
      bio: input.bio,
      city: input.city,
      area: input.area === '' ? null : input.area,
      isAcceptingBookings: input.isAcceptingBookings,
    });

    return toPublicPartner(updated);
  },

  /**
   * Public detail view. Only verified, active partners are visible to
   * strangers — the owner (and, later, admins) can still see their own
   * unverified/pending profile. Returning 404 rather than 403 for anyone
   * else avoids confirming an unverified partner's id exists at all.
   */
  async getPublicProfile(partnerId: string, requestingUserId?: string) {
    const profile = await partnerRepository.findById(partnerId);
    if (!profile) {
      throw new NotFoundError('Partner not found');
    }

    const isOwner = requestingUserId && profile.userId === requestingUserId;
    const isPubliclyVisible =
      profile.user.verificationStatus === 'VERIFIED';

    if (!isPubliclyVisible && !isOwner) {
      throw new NotFoundError('Partner not found');
    }

    return toPublicPartner(profile);
  },

  async searchPartners(query: DiscoverPartnersQuery) {
    const { items, total } = await partnerRepository.search({
      page: query.page,
      limit: query.limit,
      city: query.city,
      gender: query.gender,
      serviceCategorySlug: query.serviceCategory,
      dayOfWeek: query.dayOfWeek,
      search: query.search,
    });

    return {
      items: items.map(toPublicPartner),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async addServiceOffering(userId: string, input: AddServiceOfferingInput) {
    const profile = await partnerRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError('You do not have a partner profile yet');
    }

    const category = await serviceCategoryRepository.findById(input.serviceCategoryId);
    if (!category || !category.isActive) {
      // This is the allowlist enforcement point: a category id that isn't a
      // real, active, admin-approved category is rejected outright — there
      // is no path for a partner to attach a service outside this list.
      throw new BadRequestError('That service category is not available');
    }

    const existingOffering = await partnerRepository.findOfferingByCategoryId(
      profile.id,
      category.id
    );
    if (existingOffering) {
      throw new ConflictError('You already offer this service');
    }

    await partnerRepository.addOffering({
      partnerProfileId: profile.id,
      serviceCategoryId: category.id,
      description: input.description,
      pricePerHour: input.pricePerHour,
    });

    const updated = await partnerRepository.findByUserId(userId);
    return toPublicPartner(updated!);
  },

  async removeServiceOffering(userId: string, offeringId: string) {
    const profile = await partnerRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError('You do not have a partner profile yet');
    }

    const result = await partnerRepository.removeOffering(offeringId, profile.id);
    if (result.count === 0) {
      throw new NotFoundError('Service offering not found');
    }

    const updated = await partnerRepository.findByUserId(userId);
    return toPublicPartner(updated!);
  },

  async setAvailability(userId: string, input: SetAvailabilityInput) {
    const profile = await partnerRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError('You do not have a partner profile yet');
    }

    await partnerRepository.replaceAvailability(profile.id, input.slots);

    const updated = await partnerRepository.findByUserId(userId);
    return toPublicPartner(updated!);
  },

  async listServiceCategories() {
    return serviceCategoryRepository.findAllActive();
  },
};
