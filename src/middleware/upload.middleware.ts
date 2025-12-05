    import { v2 as cloudinary } from 'cloudinary';
    import { CloudinaryStorage } from 'multer-storage-cloudinary';
    import multer, { FileFilterCallback } from 'multer'; // 1. Import Type chuẩn của Multer
    import { Request } from 'express';
    import { StatusCodes } from 'http-status-codes';

    import { cloudinaryConfig } from '../config/cloudinary.config';
    import { AppError } from '../errors/app.error';
    import { CommonKeys } from '../constants/message-key';
    import { ErrorDetails } from '../constants/error-detail.constant';
import { UploadConstants } from '../constants/upload.constant';

    cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
    });

    interface CloudinaryParams {
    folder: string;
    allowed_formats: string[];
    public_id: (req: unknown, file: Express.Multer.File) => string;
    };

    const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: UploadConstants.FOLDER_NAME,
        allowed_formats: [...UploadConstants.ALLOWED_FORMATS],
        
        public_id: (_req: unknown, file: Express.Multer.File) => {
            const originalName = file.originalname;
            const name = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-');
            return `${name}-${Date.now().toString()}`;
        },
    } as CloudinaryParams, 
    });

    const fileFilter = (
        _req: Request, 
        file: Express.Multer.File, 
        cb: FileFilterCallback 
    ) => {
        if (file.mimetype.startsWith(UploadConstants.ALLOWED_MIME_PREFIX)) {
            cb(null, true);
        } else {
            const error = new AppError(
                StatusCodes.BAD_REQUEST, 
                CommonKeys.VALIDATION_FAILED, 
                ErrorDetails.UNSUPPORTED_FILE_TYPE
            );
            cb(error as Error);
        }
    };

    export const uploadMiddleware = multer({ 
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: UploadConstants.MAX_FILE_SIZE_BYTES
        } 
    });