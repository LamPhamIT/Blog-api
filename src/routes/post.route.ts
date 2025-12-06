import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import {
  authenticate,
  authenticateOptional,
} from '../middleware/auth.middleware';
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
  authenticateOptional,
  validate(GetPostsQuerySchema, ValidationTarget.QUERY),
  postController.getAll,
);

router.get(
  ENDPOINTS.posts.detail,
  authenticateOptional,
  validate(GetPostDetailSchema, ValidationTarget.PARAMS),
  postController.getDetail,
);

router.post(ENDPOINTS.posts.upvote, authenticate, postController.upvote);

export default router;
