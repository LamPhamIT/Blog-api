import { CommentRepository } from '../repositories/comment.repository';
import { PostRepository } from '../repositories/post.repository';
import {
  CreateCommentDTO,
  GetCommentsQueryDTO,
  UpdateCommentDTO,
} from '../dtos/comment.dto';
import { AppError } from '../errors/app.error';
import { StatusCodes } from 'http-status-codes';
import { CommentKeys, CommonKeys } from '../constants/message-key';
import { ErrorDetails } from '../constants/error-detail.constant';

const commentRepository = new CommentRepository();
const postRepository = new PostRepository();

class CommentService {
  async create(userId: string, data: CreateCommentDTO) {
    const post = await postRepository.findById(data.postId);
    if (!post) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        CommonKeys.NOT_FOUND,
        ErrorDetails.POST_NOT_FOUND,
      );
    }

    let finalParentId = data.parentId;

    if (finalParentId) {
      const parentComment = await commentRepository.findById(finalParentId);

      if (!parentComment) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          CommentKeys.COMMENT_NOT_FOUND,
          ErrorDetails.COMMENT_NOT_FOUND,
        );
      }

      if (parentComment.postId !== data.postId) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          CommentKeys.INVALID_PARENT,
          ErrorDetails.INVALID_PARENT,
        );
      }

      if (parentComment.parentId) {
        finalParentId = parentComment.parentId;
      }
    }

    return await commentRepository.create(userId, {
      ...data,
      parentId: finalParentId,
    });
  }

  async getAll(query: GetCommentsQueryDTO) {
    const { comments, total } = await commentRepository.findAll(query);
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: comments,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async update(id: string, userId: string, data: UpdateCommentDTO) {
    const comment = await commentRepository.findById(id);

    if (!comment) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        CommentKeys.COMMENT_NOT_FOUND,
        ErrorDetails.COMMENT_NOT_FOUND,
        id,
      );
    }

    if (comment.userId !== userId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        CommonKeys.FORBIDDEN_ACCESS,
        ErrorDetails.FORBIDDEN_ACCESS,
      );
    }

    return await commentRepository.update(id, data.content);
  }
}

export default new CommentService();
