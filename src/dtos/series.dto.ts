import z from "zod";

export const CreateSeriesSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(5, 'Title must be at least 5 characters long')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string().optional(),
  thumbnail: z.url('Thumbnail must be a valid URL').optional(),
});

export type CreateSeriesDTO = z.infer<typeof CreateSeriesSchema>;

export interface SeriesDto {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  author: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    posts: number;
  };
}