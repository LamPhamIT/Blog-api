import { prisma } from '../prisma/client';
import { CreateSeriesDTO } from '../dtos/series.dto';
import { Prisma } from '@prisma/client';

export const seriesSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  thumbnail: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
    },
  },
  _count: {
    select: {
      posts: true,
    },
  },
} satisfies Prisma.SeriesSelect;

export class SeriesRepository {
  async create(userId: string, slug: string, data: CreateSeriesDTO) {
    return await prisma.series.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description,
        thumbnail: data.thumbnail,
        author: {
          connect: { id: userId },
        },
      },
      select: seriesSelect,
    });
  }

  async countBySlug(slug: string): Promise<number> {
    return await prisma.series.count({
      where: { slug },
    });
  }

  async findById(id: number) {
    return await prisma.series.findUnique({
      where: { id },
    });
  }

  async findAll(skip: number, limit: number, search?: string) {
    const where: Prisma.SeriesWhereInput = search
      ? {
          title: { contains: search, mode: 'insensitive' },
        }
      : {};

    const series = await prisma.series.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: seriesSelect,
    });

    const total = await prisma.series.count({ where });

    return { series, total };
  }

  async findBySlug(slug: string) {
    return await prisma.series.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        posts: {
          where: { published: true },
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, fullName: true, avatarUrl: true } },
            tags: true,
            series: { select: { id: true, title: true, slug: true } },
            _count: { select: { upvotes: true } },
            upvotes: { take: 0 },
          },
        },
      },
    });
  }
}
