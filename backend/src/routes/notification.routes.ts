import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { listNotificationsQuerySchema } from '../validators/notification.validators';

const router = Router();

router.use(authenticate);

// Registered before "/:id/read" so the literal path "/read-all" is never
// swallowed by the single-segment id route below.
router.get('/', validate(listNotificationsQuerySchema), notificationController.list);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markRead);

export default router;
