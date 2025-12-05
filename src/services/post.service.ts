import slugify from 'slugify';
import { CreatePostDTO, GetPostsQueryDTO } from '../dtos/post.dto';
import { PostItem, PostRepository } from '../repositories/post.repository';
import { SeriesRepository } from '../repositories/series.repository';
import { AppError } from '../errors/app.error';
import { StatusCodes } from 'http-status-codes';
import { CommonKeys } from '../constants/message-key';
import { ErrorDetails } from '../constants/error-detail.constant';
import { Prisma } from '@prisma/client';
import { PostConstants } from '../constants/post.constant';
import { formatString } from '../utils/string.util';

const postRepository = new PostRepository();
const seriesRepository = new SeriesRepository();

class PostService {
  private async generateUniqueSlug(title: string): Promise<string> {
    let originalSlug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'vi',
      trim: true,
    });
    if (!originalSlug) {
      originalSlug = `post-${Date.now().toString()}`;
    }

    let slug = originalSlug;
    let count = 1;

    while ((await postRepository.countBySlug(slug)) > 0) {
      slug = `${originalSlug}-${count.toString()}`;
      count++;
    }

    return slug;
  }

  async createPost(userId: string, data: CreatePostDTO): Promise<PostItem> {
    if (data.tags && data.tags.length > PostConstants.MAX_TAGS_PER_POST) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        CommonKeys.VALIDATION_FAILED,
        {
          code: ErrorDetails.TAGS_LIMIT_EXCEEDED.code,
          detail: formatString(
            ErrorDetails.TAGS_LIMIT_EXCEEDED.detail,
            PostConstants.MAX_TAGS_PER_POST,
          ),
        },
      );
    }
    if (data.seriesId) {
      const series = await seriesRepository.findById(data.seriesId);

      if (!series) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          CommonKeys.NOT_FOUND,
          ErrorDetails.SERIES_NOT_FOUND,
        );
      }
    }

    const uniqueSlug = await this.generateUniqueSlug(data.title);

    try {
      const newPost = await postRepository.create(userId, uniqueSlug, data);
      return newPost;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('slug')) {
            return this.createPost(userId, data);
          }
        }
      }
      throw error;
    }
  }

  async getAll(query: GetPostsQueryDTO) {
    const { posts, total } = await postRepository.findAll(query);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: posts,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }
}

export default new PostService();
