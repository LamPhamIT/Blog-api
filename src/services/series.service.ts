import {
  CreateSeriesDTO,
  GetSeriesQueryDTO,
  UpdateSeriesDTO,
  AddPostsToSeriesDTO,
  RemovePostsFromSeriesDTO,
} from '../dtos/series.dto';
import { SeriesRepository } from '../repositories/series.repository';
import { AppError } from '../errors/app.error';
import { StatusCodes } from 'http-status-codes';
import { SeriesKeys, CommonKeys } from '../constants/message-key';
import { ErrorDetails } from '../constants/error-detail.constant';
import { PostMapper } from '../mappers/post.mapper';
import { PostItem } from '../repositories/post.repository';
import { generateUniqueSlug } from '../utils/slug.util';

const seriesRepository = new SeriesRepository();

class SeriesService {
  async create(userId: string, data: CreateSeriesDTO) {
    const slug = await generateUniqueSlug(data.title, async (slug) => {
      const count = await seriesRepository.countBySlug(slug);
      return count > 0;
    });

    const newSeries = await seriesRepository.create(userId, slug, data);

    if (data.postIds && data.postIds.length > 0) {
      await this.addPosts(newSeries.id, userId, { postIds: data.postIds });
    }

    return newSeries;
  }

  async getAll(query: GetSeriesQueryDTO) {
    const skip = (query.page - 1) * query.limit;
    const { series, total } = await seriesRepository.findAll(
      skip,
      query.limit,
      query.search,
    );
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: series,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getDetail(slug: string) {
    const series = await seriesRepository.findBySlug(slug);

    if (!series) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        SeriesKeys.SERIES_NOT_FOUND,
        ErrorDetails.SERIES_NOT_FOUND,
      );
    }

    const mappedPosts = series.posts.map((post) =>
      PostMapper.toDto(post as unknown as PostItem),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { posts, ...seriesData } = series;

    return {
      ...seriesData,
      posts: mappedPosts,
    };
  }

  async update(id: number, userId: string, data: UpdateSeriesDTO) {
    const series = await seriesRepository.findById(id);

    if (!series) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        SeriesKeys.SERIES_NOT_FOUND,
        ErrorDetails.SERIES_NOT_FOUND,
      );
    }

    if (series.authorId !== userId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        CommonKeys.FORBIDDEN_ACCESS,
        ErrorDetails.FORBIDDEN_ACCESS,
      );
    }

    return await seriesRepository.update(id, data);
  }

  async delete(id: number, userId: string) {
    const series = await seriesRepository.findById(id);

    if (!series) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        SeriesKeys.SERIES_NOT_FOUND,
        ErrorDetails.SERIES_NOT_FOUND,
      );
    }

    if (series.authorId !== userId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        CommonKeys.FORBIDDEN_ACCESS,
        ErrorDetails.FORBIDDEN_ACCESS,
      );
    }

    await seriesRepository.delete(id);
    return true;
  }

  async addPosts(seriesId: number, userId: string, data: AddPostsToSeriesDTO) {
    const series = await seriesRepository.findById(seriesId);

    if (!series) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        SeriesKeys.SERIES_NOT_FOUND,
        ErrorDetails.SERIES_NOT_FOUND,
      );
    }

    if (series.authorId !== userId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        CommonKeys.FORBIDDEN_ACCESS,
        ErrorDetails.FORBIDDEN_ACCESS,
      );
    }

    const currentMaxOrder = await seriesRepository.getMaxOrder(seriesId);

    await seriesRepository.addPosts(seriesId, data.postIds, currentMaxOrder);

    return true;
  }

  async removePosts(
    seriesId: number,
    userId: string,
    data: RemovePostsFromSeriesDTO,
  ) {
    const series = await seriesRepository.findById(seriesId);

    if (!series) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        SeriesKeys.SERIES_NOT_FOUND,
        ErrorDetails.SERIES_NOT_FOUND,
      );
    }

    if (series.authorId !== userId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        CommonKeys.FORBIDDEN_ACCESS,
        ErrorDetails.FORBIDDEN_ACCESS,
      );
    }

    await seriesRepository.removePosts(seriesId, data.postIds);

    return true;
  }
}

export default new SeriesService();
