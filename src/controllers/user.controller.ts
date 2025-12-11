import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import userService from '../services/user.service';
import { successResponse } from '../utils/response.factory';
import { UserKeys } from '../constants/message-key';
import { StatusCodes } from 'http-status-codes';
import { UpdateProfileDTO } from '../dtos/user.dto';

class UserController {
  getPublicProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.userId;

      const result = await userService.getPublicProfile(id, currentUserId);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(UserKeys.USER_FETCH_SUCCESS, result));
    } catch (error) {
      next(error);
    }
  };

  follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const followerId = authReq.user.userId;
      const { id } = req.params;

      await userService.follow(followerId, id);

      return res
        .status(StatusCodes.OK)
        .json(
          successResponse(UserKeys.USER_FOLLOW_SUCCESS, { isFollowing: true }),
        );
    } catch (error) {
      next(error);
    }
  };

  unfollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const followerId = authReq.user.userId;
      const { id } = req.params;

      await userService.unfollow(followerId, id);

      return res.status(StatusCodes.OK).json(
        successResponse(UserKeys.USER_UNFOLLOW_SUCCESS, {
          isFollowing: false,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.userId;
      const body = req.body as UpdateProfileDTO;

      const result = await userService.updateProfile(userId, body);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(UserKeys.USER_PROFILE_UPDATE_SUCCESS, result));
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
