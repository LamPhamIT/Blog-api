import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { CreateSeriesDTO } from "../dtos/series.dto";
import seriesService from "../services/series.service";
import { successResponse } from "../utils/response.factory";
import { SeriesKeys } from "../constants/message-key";
import { StatusCodes } from "http-status-codes";

class SeriesController {
    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user.userId;

            const body = req.body as CreateSeriesDTO;
            const result = await seriesService.create(userId, body);
        
            return res.status(StatusCodes.CREATED).json(
                successResponse(SeriesKeys.SERIES_CREATED, result)
            );

        } catch (error) {
            next(error);
        }
    }
}

export default new SeriesController();