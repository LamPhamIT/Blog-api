import { Router } from 'express';
import { ENDPOINTS } from '../constants/endpoints.constant';
import authRoutes from './auth.route';
import postRoutes from './post.route';
import uploadRoutes from './upload.route';

const router = Router();

router.use(ENDPOINTS.auth.base, authRoutes);
router.use(ENDPOINTS.posts.base, postRoutes);
router.use(ENDPOINTS.upload.base, uploadRoutes);

export default router;
