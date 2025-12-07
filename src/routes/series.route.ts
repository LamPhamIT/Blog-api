import { Router } from "express";
import { ENDPOINTS } from "../constants/endpoints.constant";
import { authenticate } from "../middleware/auth.middleware";
import seriesController from "../controllers/series.controller";
import { validate } from "../middleware/validation.middleware";
import { CreateSeriesSchema } from "../dtos/series.dto";

const router = Router();

router.post(
    ENDPOINTS.series.root,
    authenticate,
    validate(CreateSeriesSchema),
    seriesController.create,
)

export default router;