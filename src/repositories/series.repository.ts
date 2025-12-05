import { prisma } from '../prisma/client';

export class SeriesRepository {
  async findById(id: number) {
    return await prisma.series.findUnique({
      where: { id },
    });
  }
}
