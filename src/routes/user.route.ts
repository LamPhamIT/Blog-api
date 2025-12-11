import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import userController from '../controllers/user.controller';
import { ENDPOINTS } from '../constants/endpoints.constant';
import { UpdateProfileSchema } from '../dtos/user.dto';
import { ValidationTarget } from '../constants/validation.constant';
import { validate } from '../middleware/validation.middleware';

const router = Router();
router.patch(
  ENDPOINTS.users.profile,
  authenticate,
  validate(UpdateProfileSchema, ValidationTarget.BODY),
  userController.updateProfile,
);

router.post(ENDPOINTS.users.follow, authenticate, userController.follow);

router.delete(ENDPOINTS.users.follow, authenticate, userController.unfollow);

export default router;
