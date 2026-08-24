import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import partnerRoutes from './partner.routes';
import bookingRoutes from './booking.routes';
import paymentRoutes from './payment.routes';
import chatRoutes from './chat.routes';
import notificationRoutes from './notification.routes';
import sosRoutes from './sos.routes';
import reportRoutes from './report.routes';
import blockRoutes from './block.routes';
import reviewRoutes from './review.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/partners', partnerRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/sos', sosRoutes);
router.use('/reports', reportRoutes);
router.use('/blocks', blockRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);

export default router;
