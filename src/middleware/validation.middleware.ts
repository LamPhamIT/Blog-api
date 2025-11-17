import { ZodType } from "zod";
import { CommonKeys } from "../constants/message-key";
import { AppError } from "../errors/app.error";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const validate = (schema: ZodType) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body);

        if(!parsed.success) {
            const errors = parsed.error.issues.map(issue => (
                {
                    code: CommonKeys.VALIDATION_FAILED,
                    detail: issue.message,
                    field: issue.path.join('.')
                }
            ))
            const error  = new AppError(
                    StatusCodes.BAD_REQUEST,
                    CommonKeys.VALIDATION_FAILED,
                    errors,
                    errors.length
                );
            next(error);
            return;
        }
        req.body = parsed.data;
        next();
    }
}