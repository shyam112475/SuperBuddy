import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import {
  createOrderSchema,
  paymentHistoryQuerySchema,
  verifyPaymentSchema,
} from '../validators/payment.validators';

const router = Router();

router.use(authenticate);

router.post('/create-order', validate(createOrderSchema), paymentController.createOrder);
router.post('/verify', validate(verifyPaymentSchema), paymentController.verify);

// Registered before "/:id" so the literal path "/history" is never
// swallowed by the single-segment id route below.
router.get('/history', validate(paymentHistoryQuerySchema), paymentController.history);
router.get('/:id', paymentController.getById);

export default router;
