import { NextFunction, Request, Response } from 'express';
import {
  AddPostsToSeriesDTO,
  CreateSeriesDTO,
  GetSeriesQueryDTO,
  RemovePostsFromSeriesDTO,
  UpdateSeriesDTO,
} from '../dtos/series.dto';
import { successResponse } from '../utils/response.factory';
import seriesService from '../services/series.service';
import { StatusCodes } from 'http-status-codes';
import { CommonKeys, SeriesKeys } from '../constants/message-key';
import { AuthenticatedRequest } from '../types/auth';

class SeriesController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.userId;

      const body = req.body as CreateSeriesDTO;
      const result = await seriesService.create(userId, body);

      return res
        .status(StatusCodes.CREATED)
        .json(successResponse(SeriesKeys.SERIES_CREATED, result));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as GetSeriesQueryDTO;
      const result = await seriesService.getAll(query);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(SeriesKeys.SERIES_FETCHED, result));
    } catch (error) {
      next(error);
    }
  };

  getDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const result = await seriesService.getDetail(slug);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(SeriesKeys.SERIES_FETCHED, result));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.userId;
      const { id } = req.params;
      const body = req.body as UpdateSeriesDTO;

      const result = await seriesService.update(Number(id), userId, body);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(CommonKeys.SUCCESS, result));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.userId;
      const { id } = req.params;

      await seriesService.delete(Number(id), userId);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(CommonKeys.SUCCESS, null));
    } catch (error) {
      next(error);
    }
  };

  addPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.userId;
      const { id } = req.params;
      const body = req.body as AddPostsToSeriesDTO;

      await seriesService.addPosts(Number(id), userId, body);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(CommonKeys.SUCCESS, null));
    } catch (error) {
      next(error);
    }
  };

  removePosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.userId;
      const { id } = req.params;
      const body = req.body as RemovePostsFromSeriesDTO;

      await seriesService.removePosts(Number(id), userId, body);

      return res
        .status(StatusCodes.OK)
        .json(successResponse(CommonKeys.SUCCESS, null));
    } catch (error) {
      next(error);
    }
  };
}

export default new SeriesController();
