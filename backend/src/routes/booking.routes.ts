import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  cancelBookingSchema,
  createBookingSchema,
  listBookingsQuerySchema,
  rejectBookingSchema,
} from '../validators/booking.validators';

const router = Router();

// Every route requires auth — there is no public booking data. Authorization
// beyond "logged in" (is this actually your booking?) is resolved inside
// booking.service.ts on every read and every state transition.
router.use(authenticate);

router.post('/', validate(createBookingSchema), bookingController.create);
router.get('/', validate(listBookingsQuerySchema), bookingController.list);
router.get('/:id', bookingController.getById);

router.patch('/:id/accept', bookingController.accept);
router.patch('/:id/reject', validate(rejectBookingSchema), bookingController.reject);
router.patch('/:id/cancel', validate(cancelBookingSchema), bookingController.cancel);
router.patch('/:id/complete', bookingController.complete);

export default router;
