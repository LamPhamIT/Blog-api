import { CommentRepository } from '../repositories/comment.repository';
import { PostRepository } from '../repositories/post.repository';
import { CreateCommentDTO, GetCommentsQueryDTO } from '../dtos/comment.dto';
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
}

export default new CommentService();
