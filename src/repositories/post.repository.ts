import { prisma } from '../prisma/client';
import {
  CreatePostDTO,
  GetPostsQueryDTO,
  PostSortOption,
} from '../dtos/post.dto';
import { PostContentType, Prisma } from '@prisma/client';
import slugify from 'slugify';

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  excerpt: string | null;
  contentType: PostContentType;
  content: Prisma.JsonValue;
  contentHtml: string | null;
  published: boolean;
  createdAt: Date;
  viewCount: number;
  readTime: number | null;
  order: number;
  author: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
  series: {
    id: number;
    title: string;
    slug: string;
  } | null;
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  _count: {
    upvotes: number;
  } | null;
  upvotes: { id: number }[];
}

export class PostRepository {
  private getPostSelect(currentUserId?: string) {
    return {
      id: true,
      title: true,
      slug: true,
      thumbnail: true,
      excerpt: true,
      contentType: true,
      content: true,
      contentHtml: true,
      published: true,
      createdAt: true,
      viewCount: true,
      readTime: true,
      order: true,
      author: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      series: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: currentUserId
        ? {
            where: { userId: currentUserId },
            select: { id: true },
          }
        : { take: 0 },
    } satisfies Prisma.PostSelect;
  }

  async create(
    userId: string,
    slug: string,
    data: CreatePostDTO,
    htmlContent: string,
    order = 0,
  ): Promise<PostItem> {
    const tagsConnect = data.tags?.map((tagName) => {
      return {
        where: { name: tagName },
        create: {
          name: tagName,
          slug: slugify(tagName, { lower: true, strict: true, trim: true }),
        },
      };
    });

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: slug,

        contentType: data.contentType,
        content: data.content as Prisma.InputJsonValue,
        contentHtml: htmlContent,

        excerpt: data.description,
        thumbnail: data.thumbnail,
        published: data.published,
        readTime: data.readTime,
        order: order,
        author: {
          connect: { id: userId },
        },
        ...(data.seriesId && {
          series: {
            connect: { id: data.seriesId },
          },
        }),
        ...(tagsConnect &&
          tagsConnect.length > 0 && {
            tags: {
              connectOrCreate: tagsConnect,
            },
          }),
      },
      select: this.getPostSelect(userId),
    });

    return post as unknown as PostItem;
  }

  async countBySlug(slug: string): Promise<number> {
    return await prisma.post.count({
      where: {
        slug: slug,
      },
    });
  }

  async findAll(
    query: GetPostsQueryDTO,
    currentUserId?: string,
  ): Promise<{ posts: PostItem[]; total: number }> {
    const { page, limit, search, seriesId, tagSlug, isDraft, authorId, sort } =
      query;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {
      published: isDraft ? undefined : true,
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
      ...(seriesId && { seriesId: seriesId }),
      ...(authorId && { authorId: authorId }),
      ...(tagSlug && {
        tags: {
          some: { slug: tagSlug },
        },
      }),
    };

    let orderBy:
      | Prisma.PostOrderByWithRelationInput
      | Prisma.PostOrderByWithRelationInput[] = {
      createdAt: 'desc',
    };

    switch (sort) {
      case PostSortOption.OLDEST:
        orderBy = { createdAt: 'asc' };
        break;
      case PostSortOption.POPULAR:
        orderBy = [{ viewCount: 'desc' }, { createdAt: 'desc' }];
        break;
      case PostSortOption.TRENDING:
        orderBy = [{ upvotes: { _count: 'desc' } }, { createdAt: 'desc' }];
        break;
      case PostSortOption.LATEST:
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    if (seriesId) {
      orderBy = Array.isArray(orderBy)
        ? [{ order: 'asc' }, ...orderBy]
        : [{ order: 'asc' }, orderBy];
    }

    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: orderBy,
      select: this.getPostSelect(currentUserId),
    });

    const total = await prisma.post.count({ where });

    return { posts: posts as unknown as PostItem[], total };
  }

  async findBySlug(
    slug: string,
    currentUserId?: string,
  ): Promise<PostItem | null> {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: this.getPostSelect(currentUserId),
    });

    return post as unknown as PostItem | null;
  }

  async increaseView(id: string) {
    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  async toggleUpvote(userId: string, postId: string) {
    return await prisma.$transaction(async (tx) => {
      const existingUpvote = await tx.upvote.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      let isUpvoted = false;

      if (existingUpvote) {
        await tx.upvote.delete({
          where: {
            userId_postId: { userId, postId },
          },
        });
        isUpvoted = false;
      } else {
        await tx.upvote.create({
          data: {
            userId,
            postId,
          },
        });
        isUpvoted = true;
      }

      const totalUpvotes = await tx.upvote.count({
        where: { postId },
      });

      return { isUpvoted, totalUpvotes };
    });
  }

  async findById(id: string) {
    return await prisma.post.findUnique({
      where: { id },
    });
  }
}
