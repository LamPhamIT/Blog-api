import { prisma } from '../prisma/client';
import { CreateCommentDTO, GetCommentsQueryDTO } from '../dtos/comment.dto';
import { Prisma } from '@prisma/client';

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

  async findAll(query: GetCommentsQueryDTO) {
    const { page, limit, postId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CommentWhereInput = {
      postId,
      parentId: null,
    };

    const comments = await prisma.comment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        _count: {
          select: { children: true },
        },
        children: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
          },
        },
      },
    });

    const total = await prisma.comment.count({ where });

    return { comments, total };
  }
}
