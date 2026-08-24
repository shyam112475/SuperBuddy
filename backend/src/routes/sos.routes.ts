import { Router } from 'express';
import { sosController } from '../controllers/sos.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { createSOSAlertSchema, resolveSOSAlertSchema } from '../validators/sos.validators';

const router = Router();

router.use(authenticate);

// Deliberately NOT rate-limited — safety-critical endpoints are never
// throttled, even though most other write endpoints in the app are.
router.post('/', validate(createSOSAlertSchema), sosController.create);
router.get('/:id', sosController.getById);
router.patch('/:id/resolve', validate(resolveSOSAlertSchema), sosController.resolve);

export default router;
