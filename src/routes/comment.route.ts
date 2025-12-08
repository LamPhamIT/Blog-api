import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import commentController from '../controllers/comment.controller';
import {
  CreateCommentSchema,
  GetCommentsQuerySchema,
  UpdateCommentSchema,
} from '../dtos/comment.dto';
import { ValidationTarget } from '../constants/validation.constant';
import { ENDPOINTS } from '../constants/endpoints.constant';

const router = Router();

router.post(
  ENDPOINTS.comment.root,
  authenticate,
  validate(CreateCommentSchema, ValidationTarget.BODY),
  commentController.create,
);

router.get(
  ENDPOINTS.comment.root,
  validate(GetCommentsQuerySchema, ValidationTarget.QUERY),
  commentController.getAll,
);

router.patch(
  ENDPOINTS.comment.id,
  authenticate,
  validate(UpdateCommentSchema, ValidationTarget.BODY),
  commentController.update,
);

export default router;
