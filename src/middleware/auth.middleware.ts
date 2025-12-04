import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error';
import { accessTokenProvider, TokenPayload } from '../utils/token.provider';
import { StatusCodes } from 'http-status-codes';
import { AuthKeys } from '../constants/message-key';

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(StatusCodes.UNAUTHORIZED, AuthKeys.TOKEN_MISSING);
  }

  const token = authHeader.split(' ')[1];
  const decoded: TokenPayload | null = accessTokenProvider.verify(token);

  if (!decoded) {
    throw new AppError(StatusCodes.UNAUTHORIZED, AuthKeys.TOKEN_INVALID);
  }

  req.user = decoded;

  next();
};
