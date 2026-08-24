import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { createReviewSchema } from '../validators/review.validators';

const router = Router();

router.use(authenticate);
router.post('/', validate(createReviewSchema), reviewController.create);

export default router;
