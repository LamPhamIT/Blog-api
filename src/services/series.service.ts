import { CreateSeriesDTO } from '../dtos/series.dto';
import { SeriesRepository } from '../repositories/series.repository';
import { generateUniqueSlug } from '../utils/slug.util';

const seriesRepository = new SeriesRepository();

class SeriesService {
  async create(userId: string, data: CreateSeriesDTO) {
    const slug = await generateUniqueSlug(data.title, async (slug) => {
      const count = await seriesRepository.countBySlug(slug);
      return count > 0;
    });

    return await seriesRepository.create(userId, slug, data);
  }
}

export default new SeriesService();