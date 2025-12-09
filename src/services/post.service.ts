import {
  CreatePostDTO,
  GetPostsQueryDTO,
  UpvoteResponseDto,
  PostDto,
} from '../dtos/post.dto';
import { PostRepository } from '../repositories/post.repository';
import { SeriesRepository } from '../repositories/series.repository';
import { AppError } from '../errors/app.error';
import { StatusCodes } from 'http-status-codes';
import { CommonKeys, PostKeys } from '../constants/message-key';
import { ErrorDetails } from '../constants/error-detail.constant';
import { PostConstants } from '../constants/post.constant';
import { formatString } from '../utils/string.util';
import { Prisma } from '@prisma/client';
import { PostMapper } from '../mappers/post.mapper';
import { PostContentUtil } from '../utils/post-content.util';
import { generateUniqueSlug } from '../utils/slug.util';

const postRepository = new PostRepository();
const seriesRepository = new SeriesRepository();

class PostService {
  async createPost(userId: string, data: CreatePostDTO): Promise<PostDto> {
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

    let nextOrder = 0;

    if (data.seriesId) {
      const series = await seriesRepository.findById(data.seriesId);

      if (!series) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          CommonKeys.NOT_FOUND,
          ErrorDetails.SERIES_NOT_FOUND,
        );
      }

      const currentMaxOrder = await seriesRepository.getMaxOrder(data.seriesId);
      nextOrder = currentMaxOrder + 1;
    }

    const safeContent = data.content as Prisma.JsonValue;
    const htmlContent = PostContentUtil.generateHtml(
      data.contentType,
      safeContent,
    );
    const plainText = PostContentUtil.extractPlainText(
      data.contentType,
      safeContent,
    );

    data.description ??=
      plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');

    if (!data.readTime) {
      const wordCount = plainText.split(/\s+/).length;
      data.readTime = Math.ceil(wordCount / 200) || 1;
    }

    const uniqueSlug = await generateUniqueSlug(data.title, async (slug) => {
      const count = await postRepository.countBySlug(slug);
      return count > 0;
    });

    try {
      const newPost = await postRepository.create(
        userId,
        uniqueSlug,
        data,
        htmlContent,
        nextOrder,
      );

      return PostMapper.toDto(newPost);
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

  async getAll(query: GetPostsQueryDTO, currentUserId?: string) {
    const { posts, total } = await postRepository.findAll(query, currentUserId);

    const mappedPosts = posts.map((post) => PostMapper.toDto(post));

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: mappedPosts,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getDetail(slug: string, currentUserId?: string) {
    const post = await postRepository.findBySlug(slug, currentUserId);

    if (!post) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        PostKeys.POST_NOT_FOUND,
        ErrorDetails.POST_NOT_FOUND,
        slug,
      );
    }

    postRepository.increaseView(post.id).catch(() => {
      /* empty */
    });

    return PostMapper.toDto(post);
  }

  async toggleUpvote(
    userId: string,
    postId: string,
  ): Promise<UpvoteResponseDto> {
    const post = await postRepository.findById(postId);

    if (!post) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        PostKeys.POST_NOT_FOUND,
        ErrorDetails.POST_NOT_FOUND,
      );
    }

    const { isUpvoted, totalUpvotes } = await postRepository.toggleUpvote(
      userId,
      postId,
    );

    return {
      postId,
      isUpvoted,
      totalUpvotes,
    };
  }
}

export default new PostService();
