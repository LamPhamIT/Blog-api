import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { RegisterSchema } from "../dtos/auth.dto";
import authController from "../controllers/auth.controller";
import { ENDPOINTS } from "../constants/endpoints.constant";

const router = Router();

router.post(ENDPOINTS.auth.register, validate(RegisterSchema), authController.register);

export default router;