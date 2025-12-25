import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/response.factory';
import { CommonKeys } from '../constants/message-key';

class ConfigController {
  getGeminiKey = (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = process.env.GEMINI_API_KEY;

      if (!key) {
        throw new Error('Gemini Key not found in environment variables');
      }

      return res.status(StatusCodes.OK).json(
        successResponse(CommonKeys.SUCCESS, {
          apiKey: key, 
        })
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new ConfigController();