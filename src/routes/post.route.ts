import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  CreatePostSchema,
  GetPostDetailSchema,
  GetPostsQuerySchema,
} from '../dtos/post.dto';
import postController from '../controllers/post.controller';
import { ENDPOINTS } from '../constants/endpoints.constant';
import { ValidationTarget } from '../constants/validation.constant';

const router = Router();

router.post(
  ENDPOINTS.posts.root,
  authenticate,
  validate(CreatePostSchema),
  postController.create,
);

router.get(
  ENDPOINTS.posts.root,
  validate(GetPostsQuerySchema, ValidationTarget.QUERY),
  postController.getAll,
);

router.get(
  ENDPOINTS.posts.detail,
  validate(GetPostDetailSchema, ValidationTarget.PARAMS),
  postController.getDetail,
);

export default router;
