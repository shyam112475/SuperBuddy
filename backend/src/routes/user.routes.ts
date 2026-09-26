import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { imageUpload } from '../middleware/upload.middleware';
import { updateProfileSchema, changePasswordSchema } from '../validators/user.validators';

const router = Router();

// Every route here operates on the authenticated caller's own account —
// there is no :userId param, so there's no way to reach anyone else's data.
router.use(authenticate);

router.get('/me', userController.getMe);
router.put('/me', validate(updateProfileSchema), userController.updateMe);
router.delete('/me', userController.deleteMe);

router.post('/me/profile-image', imageUpload.single('image'), userController.updateProfileImage);
router.patch('/me/password', validate(changePasswordSchema), userController.changePassword);

export default router;
