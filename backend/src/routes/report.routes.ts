import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { createReportSchema } from '../validators/report.validators';

const router = Router();

router.use(authenticate);

router.post('/', validate(createReportSchema), reportController.create);
router.get('/mine', reportController.listMine);

export default router;
