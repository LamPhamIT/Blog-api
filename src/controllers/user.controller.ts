import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import userService from '../services/user.service';
import { successResponse } from '../utils/response.factory';
import { UserKeys } from '../constants/message-key';
import { StatusCodes } from 'http-status-codes';

class UserController {
  follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const followerId = authReq.user.userId;
      const { id } = req.params;

      await userService.follow(followerId, id);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(UserKeys.USER_FOLLOW_SUCCESS, { isFollowing: true }));
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

      return res
        .status(StatusCodes.OK)
        .json(successResponse(UserKeys.USER_UNFOLLOW_SUCCESS, { isFollowing: false }));
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();