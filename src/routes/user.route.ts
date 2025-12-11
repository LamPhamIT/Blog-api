import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import userController from '../controllers/user.controller';
import { ENDPOINTS } from '../constants/endpoints.constant';

const router = Router();

router.post(
  ENDPOINTS.users.follow,
  authenticate,
  userController.follow,
);

router.delete(
  ENDPOINTS.users.follow,
  authenticate,
  userController.unfollow,
);

export default router;