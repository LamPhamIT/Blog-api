import { CreateSeriesDTO, GetSeriesQueryDTO } from '../dtos/series.dto';
import { SeriesRepository } from '../repositories/series.repository';
import { AppError } from '../errors/app.error';
import { StatusCodes } from 'http-status-codes';
import { SeriesKeys } from '../constants/message-key';
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

    return await seriesRepository.create(userId, slug, data);
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
      PostMapper.toDto(post as PostItem),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { posts, ...seriesData } = series;

    return {
      ...seriesData,
      posts: mappedPosts,
    };
  }
}

export default new SeriesService();
