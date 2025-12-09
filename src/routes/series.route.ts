import { Router } from 'express';
import { ENDPOINTS } from '../constants/endpoints.constant';
import { authenticate } from '../middleware/auth.middleware';
import seriesController from '../controllers/series.controller';
import { validate } from '../middleware/validation.middleware';
import {
  AddPostsToSeriesSchema,
  CreateSeriesSchema,
  GetSeriesQuerySchema,
  RemovePostsFromSeriesSchema,
  UpdateSeriesSchema,
} from '../dtos/series.dto';
import { ValidationTarget } from '../constants/validation.constant';

const router = Router();

router.get(
  ENDPOINTS.series.root,
  validate(GetSeriesQuerySchema, ValidationTarget.QUERY),
  seriesController.getAll,
);

router.get(ENDPOINTS.series.detail, seriesController.getDetail);

router.post(
  ENDPOINTS.series.root,
  authenticate,
  validate(CreateSeriesSchema, ValidationTarget.BODY),
  seriesController.create,
);

router.patch(
  ENDPOINTS.series.id,
  authenticate,
  validate(UpdateSeriesSchema, ValidationTarget.BODY),
  seriesController.update,
);

router.delete(ENDPOINTS.series.id, authenticate, seriesController.delete);

router.patch(
  ENDPOINTS.series.posts,
  authenticate,
  validate(AddPostsToSeriesSchema, ValidationTarget.BODY),
  seriesController.addPosts,
);

router.delete(
  ENDPOINTS.series.posts,
  authenticate,
  validate(RemovePostsFromSeriesSchema, ValidationTarget.BODY),
  seriesController.removePosts,
);

export default router;
