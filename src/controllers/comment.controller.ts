import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { CreateCommentDTO } from '../dtos/comment.dto';
import commentService from '../services/comment.service';
import { successResponse } from '../utils/response.factory';
import { CommentKeys } from '../constants/message-key';
import { StatusCodes } from 'http-status-codes';

class CommentController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.userId;
      const body = req.body as CreateCommentDTO;

      const result = await commentService.create(userId, body);

      return res
        .status(StatusCodes.CREATED)
        .json(successResponse(CommentKeys.COMMENT_CREATED, result));
    } catch (error) {
      next(error);
    }
  };
}

export default new CommentController();