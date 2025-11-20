import { Router } from 'express';
import { ENDPOINTS } from '../constants/endpoints.constant';
import authRoutes from './auth.route';

const router = Router();

router.use(ENDPOINTS.auth.base, authRoutes);

export default router;
