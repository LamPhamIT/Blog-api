import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/response.factory';
import { AppError } from '../errors/app.error';
import { CommonKeys, UploadKeys } from '../constants/message-key';
import { ErrorDetails } from '../constants/error-detail.constant';

class UploadController {
  
  uploadImage = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError(
            StatusCodes.BAD_REQUEST, 
            CommonKeys.VALIDATION_FAILED, 
            ErrorDetails.NO_FILE_UPLOADED
        );
      }
      const data = {
        url: req.file.path, 
        publicId: req.file.filename,
        format: req.file.mimetype,
        size: req.file.size
      };

      return res.status(StatusCodes.OK).json(
        successResponse(UploadKeys.IMAGE_UPLOAD_SUCCESS, data)
      );

    } catch (error) {
      next(error);
    }
  };
}

export default new UploadController();