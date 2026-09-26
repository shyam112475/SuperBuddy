import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { listMessagesQuerySchema, sendMessageSchema } from '../validators/chat.validators';

const router = Router();

router.use(authenticate);

router.get('/:bookingId/messages', validate(listMessagesQuerySchema), chatController.listMessages);
router.post('/:bookingId/messages', validate(sendMessageSchema), chatController.sendMessage);
router.patch('/:bookingId/read', chatController.markRead);

export default router;
