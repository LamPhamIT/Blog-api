import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadMiddleware } from '../middleware/upload.middleware';
import uploadController from '../controllers/upload.controller';
import { ENDPOINTS } from '../constants/endpoints.constant';

const router = Router();

router.post(
  ENDPOINTS.upload.image,
  authenticate,
  uploadMiddleware.single('image'),
  uploadController.uploadImage,
);

export default router;
