import { Request, Response, NextFunction } from 'express';
import { LoginDTO, RegisterDTO } from '../dtos/auth.dto';
import authService from '../services/auth.service';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/response.factory';
import { AuthKeys, UserKeys } from '../constants/message-key';
import { AuthenticatedRequest } from '../types/auth';
import userService from '../services/user.service';

class AuthController {
  register = async (
    req: Request<Record<string, unknown>, unknown, RegisterDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = await authService.register(req.body);
      return res
        .status(StatusCodes.CREATED)
        .json(successResponse(UserKeys.USER_CREATED, user));
    } catch (error) {
      next(error);
    }
  };
  login = async (
    req: Request<Record<string, unknown>, unknown, LoginDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await authService.login(req.body);
      return res
        .status(StatusCodes.OK)
        .json(successResponse(AuthKeys.LOGIN_SUCCESS, result));
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.userId;
      const user = await userService.getProfile(userId);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(UserKeys.USER_FETCH_SUCCESS, user));
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
