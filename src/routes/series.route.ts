import { Router } from 'express';
import { ENDPOINTS } from '../constants/endpoints.constant';
import { authenticate } from '../middleware/auth.middleware';
import seriesController from '../controllers/series.controller';
import { validate } from '../middleware/validation.middleware';
import { CreateSeriesSchema, GetSeriesQuerySchema } from '../dtos/series.dto';
import { ValidationTarget } from '../constants/validation.constant';

const router = Router();

router.post(
  ENDPOINTS.series.root,
  authenticate,
  validate(CreateSeriesSchema),
  seriesController.create,
);

router.get(
  ENDPOINTS.series.root,
  validate(GetSeriesQuerySchema, ValidationTarget.QUERY),
  seriesController.getAll,
);

router.get(ENDPOINTS.series.detail, seriesController.getDetail);

export default router;
