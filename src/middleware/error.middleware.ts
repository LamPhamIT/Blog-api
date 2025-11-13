import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.factory';
import { AppError } from '../errors/app.error';
import { CommonKeys } from '../constants/message-key/common.key';
import { ErrorDetails } from '../constants/error-detail.constant';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(
        errorResponse(err.messageKey, err.details ?? [], ...(err.args ?? [])),
      );
  }

  return res.status(500).json({
    ...errorResponse(
      CommonKeys.INTERNAL_SERVER_ERROR,
      ErrorDetails.INTERNAL_SERVER_ERROR,
    ),
  });
};
