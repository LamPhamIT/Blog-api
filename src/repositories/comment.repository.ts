import { prisma } from '../prisma/client';
import { CreateCommentDTO } from '../dtos/comment.dto';

export class CommentRepository {
  async create(userId: string, data: CreateCommentDTO) {
    return await prisma.comment.create({
      data: {
        content: data.content,
        postId: data.postId,
        parentId: data.parentId,
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return await prisma.comment.findUnique({
      where: { id },
    });
  }
}