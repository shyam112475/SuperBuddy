import { Router } from 'express';
import { blockController } from '../controllers/block.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { createBlockSchema } from '../validators/block.validators';

const router = Router();

router.use(authenticate);

router.post('/', validate(createBlockSchema), blockController.create);
router.get('/', blockController.listMine);
router.delete('/:userId', blockController.remove);

export default router;
