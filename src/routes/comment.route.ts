import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import commentController from '../controllers/comment.controller';
import { CreateCommentSchema } from '../dtos/comment.dto';
import { ValidationTarget } from '../constants/validation.constant';
import { ENDPOINTS } from '../constants/endpoints.constant';

const router = Router();

router.post(
  ENDPOINTS.comment.root,
  authenticate,
  validate(CreateCommentSchema, ValidationTarget.BODY),
  commentController.create,
);

export default router;