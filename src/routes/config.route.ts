import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import configController from '../controllers/config.controller';
import { ENDPOINTS } from '../constants/endpoints.constant';

const router = Router();

router.get(
  ENDPOINTS.config.geminiKey,
  authenticate, 
  configController.getGeminiKey
);

export default router;