import { NextFunction, Request, Response } from 'express';
import { CreatePostDTO, GetPostsQueryDTO } from '../dtos/post.dto';
import { successResponse } from '../utils/response.factory';
import postService from '../services/post.service';
import { StatusCodes } from 'http-status-codes';
import { PostKeys } from '../constants/message-key';
import { AuthenticatedRequest } from '../types/auth';

class PostController {
  create = async (
    req: Request<Record<string, unknown>, unknown, CreatePostDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.userId;
      const post = await postService.createPost(userId, req.body);

      return res
        .status(StatusCodes.CREATED)
        .json(successResponse(PostKeys.POST_CREATED, post));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as GetPostsQueryDTO;

      const result = await postService.getAll(query);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: PostKeys.POST_FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new PostController();
