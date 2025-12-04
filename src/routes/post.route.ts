import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { CreatePostSchema, } from '../dtos/post.dto';
import postController from '../controllers/post.controller';
import { ENDPOINTS } from '../constants/endpoints.constant';

const router = Router();

router.post(
  ENDPOINTS.posts.root,
  authenticate,              
  validate(CreatePostSchema), 
  postController.create
);

export default router;