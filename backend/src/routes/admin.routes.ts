import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  adminListBookingsQuerySchema,
  adminListPartnersQuerySchema,
  adminListPaymentsQuerySchema,
  adminListReportsQuerySchema,
  adminListSOSQuerySchema,
  adminListUsersQuerySchema,
  updateReportStatusSchema,
  verifyPartnerSchema,
} from '../validators/admin.validators';

const router = Router();

// Every route in this file requires an authenticated ADMIN — there is no
// partial access tier here; a non-admin gets a 403 from `authorize` before
// any handler runs.
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.dashboard);

router.get('/users', validate(adminListUsersQuerySchema), adminController.listUsers);

router.get('/partners', validate(adminListPartnersQuerySchema), adminController.listPartners);
router.patch('/partners/:id/verify', validate(verifyPartnerSchema), adminController.verifyPartner);

router.get('/bookings', validate(adminListBookingsQuerySchema), adminController.listBookings);

router.get('/payments', validate(adminListPaymentsQuerySchema), adminController.listPayments);

router.get('/sos', validate(adminListSOSQuerySchema), adminController.listSOSAlerts);

router.get('/reports', validate(adminListReportsQuerySchema), adminController.listReports);
router.patch(
  '/reports/:id/status',
  validate(updateReportStatusSchema),
  adminController.updateReportStatus
);

export default router;
