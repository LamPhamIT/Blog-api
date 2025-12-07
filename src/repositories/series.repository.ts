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
}