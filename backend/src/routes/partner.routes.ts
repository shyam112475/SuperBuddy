import { Router } from 'express';
import { partnerController } from '../controllers/partner.controller';
import { reviewController } from '../controllers/review.controller';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  addServiceOfferingSchema,
  createPartnerProfileSchema,
  discoverPartnersQuerySchema,
  setAvailabilitySchema,
  updatePartnerProfileSchema,
} from '../validators/partner.validators';
import { listPartnerReviewsQuerySchema } from '../validators/review.validators';

const router = Router();

// ── Public: service category allowlist (used to populate discovery filters
// and the "offer a service" picker) ────────────────────────────────────────
router.get('/categories', partnerController.listServiceCategories);

// ── Authenticated: the caller's own partner profile ────────────────────────
// Registered before "/:id" so literal "/profile" never gets swallowed by
// the single-segment public-detail route below.
router.get('/profile', authenticate, partnerController.getMyProfile);
router.post(
  '/profile',
  authenticate,
  validate(createPartnerProfileSchema),
  partnerController.createProfile
);
router.put(
  '/profile',
  authenticate,
  authorize('PARTNER'),
  validate(updatePartnerProfileSchema),
  partnerController.updateMyProfile
);

router.post(
  '/profile/services',
  authenticate,
  authorize('PARTNER'),
  validate(addServiceOfferingSchema),
  partnerController.addServiceOffering
);
router.delete(
  '/profile/services/:offeringId',
  authenticate,
  authorize('PARTNER'),
  partnerController.removeServiceOffering
);
router.put(
  '/profile/availability',
  authenticate,
  authorize('PARTNER'),
  validate(setAvailabilitySchema),
  partnerController.setAvailability
);

// ── Public: discovery ───────────────────────────────────────────────────────
router.get('/', validate(discoverPartnersQuerySchema), partnerController.search);
router.get(
  '/:id/reviews',
  validate(listPartnerReviewsQuerySchema),
  reviewController.listForPartner
);
// Must stay last — any single path segment under /api/partners not matched
// above falls through to this and is treated as a partner id.
router.get('/:id', optionalAuthenticate, partnerController.getPublicProfile);

export default router;
