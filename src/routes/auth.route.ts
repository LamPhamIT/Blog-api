import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { LoginSchema, RegisterSchema } from '../dtos/auth.dto';
import authController from '../controllers/auth.controller';
import { ENDPOINTS } from '../constants/endpoints.constant';

const router = Router();

router.post(
  ENDPOINTS.auth.register,
  validate(RegisterSchema),
  authController.register,
);

router.post(ENDPOINTS.auth.login, validate(LoginSchema), authController.login);

export default router;
