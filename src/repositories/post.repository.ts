import { prisma } from '../prisma/client';
import { CreatePostDTO, GetPostsQueryDTO } from '../dtos/post.dto';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';

const postSelect = {
  id: true,
  title: true,
  slug: true,
  thumbnail: true,
  excerpt: true,
  published: true,
  createdAt: true,
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
} as const;

export type PostItem = Prisma.PostGetPayload<{ select: typeof postSelect }>;

export class PostRepository {
  async create(
    userId: string,
    slug: string,
    data: CreatePostDTO,
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
    return await prisma.post.create({
      data: {
        title: data.title,
        slug: slug,
        content: data.content,
        excerpt: data.description,
        thumbnail: data.thumbnail,
        published: data.published,
        readTime: data.readTime,

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
      select: postSelect,
    });
  }

  async countBySlug(slug: string): Promise<number> {
    return await prisma.post.count({
      where: {
        slug: slug,
      },
    });
  }

  async findAll(query: GetPostsQueryDTO) {
    const { page, limit, search, seriesId, tagSlug, isDraft } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {
      published: isDraft ? undefined : true,

      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),

      ...(seriesId && { seriesId: seriesId }),

      ...(tagSlug && {
        tags: {
          some: { slug: tagSlug },
        },
      }),
    };

    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: postSelect,
    });

    const total = await prisma.post.count({ where });

    return { posts, total };
  }

  async findBySlug(slug: string) {
    return await prisma.post.findUnique({
      where: { slug },
      select: postSelect,
    });
  }

  async increaseView(id: string) {
    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }
}
