import { ZodType } from 'zod';
import { CommonKeys } from '../constants/message-key';
import { AppError } from '../errors/app.error';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ValidationTarget,
  ValidationTargetType,
} from '../constants/validation.constant';

export const validate = (
  schema: ZodType,
  target: ValidationTargetType = ValidationTarget.BODY,
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    let dataToValidate: unknown;
    switch (target) {
      case ValidationTarget.QUERY:
        dataToValidate = req.query;
        break;
      case ValidationTarget.PARAMS:
        dataToValidate = req.params;
        break;
      case ValidationTarget.BODY:
      default:
        dataToValidate = req.body;
        break;
    }
    const parsed = schema.safeParse(dataToValidate);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        code: CommonKeys.VALIDATION_FAILED,
        detail: issue.message,
        field: issue.path.join('.'),
      }));
      const error = new AppError(
        StatusCodes.BAD_REQUEST,
        CommonKeys.VALIDATION_FAILED,
        errors,
        errors.length,
      );

      next(error);
      return;
    }
    switch (target) {
      case ValidationTarget.QUERY:
        Object.defineProperty(req, 'query', {
          value: parsed.data,
          writable: true,
          configurable: true,
        });
        break;

      case ValidationTarget.PARAMS:
        Object.defineProperty(req, 'params', {
          value: parsed.data,
          writable: true,
          configurable: true,
        });
        break;

      case ValidationTarget.BODY:
      default:
        req.body = parsed.data;
        break;
    }
    next();
  };
};
