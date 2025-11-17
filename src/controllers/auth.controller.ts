import { Request, Response, NextFunction } from "express";
import { RegisterDTO } from "../dtos/auth.dto"
import authService from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../utils/response.factory";
import { UserKeys } from "../constants/message-key";

class AuthController {
    register = async(req: Request<Record<string, unknown>, unknown, RegisterDTO>, res: Response, next: NextFunction) => {
        try {
            const user = await authService.register(req.body);
            return res.status(StatusCodes.CREATED).json(
                successResponse(
                    UserKeys.USER_CREATED_SUCCESS,
                    user
                )
            )

        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();